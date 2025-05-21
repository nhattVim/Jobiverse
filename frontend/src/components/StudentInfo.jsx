import React, { useState, useEffect } from 'react'
import apiFetch from '../services/api'

const StudentInfo = ({
  profile,
  email,
  handleChange,
  handleSubmit,
  loadingSubmit
}) => {
  const [majorList, setMajorList] = useState([])
  const [specList, setSpecList] = useState([])

  const fieldConfigs = {
    name: {
      label: 'Họ và tên',
      required: true,
      placeholder: 'VD: Nguyen Van A',
      type: 'text'
    },
    mssv: {
      label: 'Mã sinh viên',
      required: true,
      placeholder: 'VD: 4551050232',
      type: 'text'
    },
    university: {
      label: 'Trường',
      required: true,
      placeholder: 'VD: Đại học Quy Nhơn',
      type: 'text'
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [majorsData, specsData] = await Promise.all([
          apiFetch('/majors'),
          apiFetch('/specs')
        ])
        setMajorList(majorsData)
        setSpecList(specsData)
      } catch (err) {
        console.error('Fetch data failed:', err)
      }
    }

    loadData()
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <section className="p-10 border border-gray-200 shadow-md bg-white-low rounded-medium">
        <h2 className="mb-2 text-2xl font-bold">Cài đặt thông tin sinh viên</h2>
        <p className="mb-6 text-sm text-black">
          <span className="text-red-500">*</span> Các thông tin bắt buộc
        </p>

        <div className="space-y-6">
          {Object.entries(fieldConfigs).map(([key, config]) => (
            <div key={key}>
              <label className="block mb-1 text-sm font-bold text-gray-700">
                {config.label} {config.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={config.type}
                name={key}
                value={profile[key] || ''}
                onChange={handleChange}
                placeholder={config.placeholder}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          {/* Chọn ngành và chuyên ngành */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">Ngành</label>
              <select
                name="major"
                value={profile.major}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn ngành --</option>
                {majorList.map((major) => (
                  <option key={major._id} value={major._id}>
                    {major.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">Chuyên ngành</label>
              <select
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn chuyên ngành --</option>
                {specList
                  .filter(spec => spec.major === profile.major)
                  .map((spec) => (
                    <option key={spec._id} value={spec._id}>
                      {spec.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Email readonly */}
          <div>
            <label className="block mb-1 text-sm font-bold text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={email}
              readOnly
              className="w-full px-4 py-2 text-gray-800 bg-gray-300 rounded-full cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loadingSubmit}
            className={`px-6 py-2 text-white transition rounded-full cursor-pointer bg-blue hover:opacity-90 ${loadingSubmit ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loadingSubmit ? 'Đang lưu...' : 'Lưu lại'}
          </button>
        </div>
      </section>
    </form>
  )
}

export default StudentInfo
