import React, { useContext, useEffect, useState } from 'react'
import Profile from '../components/Profile'
import apiFetch from '../services/api'
import { useNavigate } from 'react-router-dom'
import UserContext from '../contexts/UserContext'

const StudentProfile = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    mssv: '',
    major: '',
    specialization: '',
    interests: [''],
    university: ''
  })

  const [majorList, setMajorList] = useState([])
  const [specList, setSpecList] = useState([])
  const { setUser, updateTimestamp } = useContext(UserContext)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    const requiredFields = ['name', 'mssv', 'university']
    for (const field of requiredFields) {
      if (!form[field]) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc.')
        return
      }
    }

    try {
      await apiFetch('/students', 'POST', form)
      await apiFetch('/account/profile', 'PUT')
      const user = await apiFetch('/account/detail', 'GET')
      setUser(user)
      updateTimestamp()
      navigate('/')
    } catch (err) {
      console.error(err)
      setError('Tạo profile thất bại, vui lòng thử lại.')
    }
  }

  return (
    <Profile
      title="Tạo profile cho người tìm việc"
      caption="Tạo hồ sơ cá nhân để gây ấn tượng với nhà tuyển dụng và mở ra những cơ hội nghề nghiệp phù hợp."
    >
      <form onSubmit={handleSubmit} className="pb-20">
        <section className="p-10 border border-gray-200 shadow-md bg-white-low rounded-medium">
          <h2 className="mb-6 text-xl font-bold">Thông tin ứng viên</h2>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="space-y-6">
            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Nguyen Van A"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">
                Mã sinh viên
              </label>
              <input
                type="text"
                name="mssv"
                value={form.mssv}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: 4551050232"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">
                Trường
              </label>
              <input
                type="text"
                name="university"
                value={form.university}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Đại học Quy Nhơn"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Ngành
                </label>
                <select
                  name="major"
                  value={form.major}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      major: e.target.value,
                      specialization: ''
                    }))
                  }
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
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Chuyên Ngành
                </label>
                <select
                  name="specialization"
                  value={form.specialization}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      specialization: e.target.value
                    }))
                  }
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn chuyên ngành --</option>
                  {specList
                    .filter((spec) => spec.major === form.major)
                    .map((spec) => (
                      <option key={spec._id} value={spec._id}>
                        {spec.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Nút huỷ */}
            <div className="flex items-center gap-4">
              <div
                onClick={() => navigate('/')}
                className="px-6 py-2 text-white transition rounded-full bg-red hover:bg-red-700 cursor-pointer"
              >
                Huỷ
              </div>
              {/* Nút submit */}
              <button
                type="submit"
                className="px-6 py-2 text-white transition rounded-full bg-blue hover:bg-blue-700 cursor-pointer"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </section>
      </form>
    </Profile>
  )
}

export default StudentProfile
