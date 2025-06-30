import React from 'react'

const EmployerInfo = ({
  profile,
  email,
  handleChange,
  handleSubmit,
  loadingSubmit
}) => {
  const employerFields = {
    companyName: {
      label: 'Tên công ty',
      type: 'text',
      placeholder: 'Fpt Software'
    },
    representativeName: {
      label: 'Tên người đại diện',
      type: 'text',
      placeholder: 'Nguyễn Văn A'
    },
    position: {
      label: 'Chức vụ',
      type: 'text',
      placeholder: 'CEO'
    },
    businessScale: {
      label: 'Quy mô kinh doanh',
      type: 'select',
      options: [
        { value: '', label: '-- Chọn --' },
        { value: 'Private individuals', label: 'Cá nhân' },
        { value: 'Companies', label: 'Công ty' }
      ]
    },
    industry: {
      label: 'Ngành nghề',
      type: 'text',
      placeholder: 'Công nghệ, Giáo dục,...'
    },
    address: {
      label: 'Địa chỉ',
      type: 'text',
      placeholder: '123 Đường ABC, Quận XYZ'
    },
    prove: {
      label: 'Giấy chứng minh pháp lý',
      type: 'text',
      placeholder: 'Số giấy phép đăng ký kinh doanh'
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <section className="p-10 border border-gray-200 shadow-md bg-white-low rounded-medium">
        <h2 className="mb-2 text-2xl font-bold text-blue">Cài đặt thông tin doanh nghiệp</h2>
        <p className="mb-6 text-sm text-black">
          <span className="text-red-500">*</span> Các thông tin bắt buộc
        </p>

        {/* Lưới các input 2 cột */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Object.entries(employerFields).map(([fieldName, field]) => (
            <div key={fieldName}>
              <label className="block mb-1 text-sm font-bold text-gray-700">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  name={fieldName}
                  value={profile[fieldName]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={fieldName}
                  value={profile[fieldName]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}

        </div>

        <div className="mt-8">
          <label className="block mb-1 text-sm font-bold text-gray-700">
            Mô tả công ty
          </label>
          <textarea
            name="companyInfo"
            value={profile.companyInfo}
            onChange={handleChange}
            placeholder="Thông tin giới thiệu"
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
            rows={5}
          />
        </div>

        <div className="mt-8 md:col-span-2">
          <label className="block mb-1 text-sm font-bold text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            readOnly
            className="w-full px-4 py-2 text-gray-800 bg-gray-300 border border-gray-300 rounded-full cursor-not-allowed focus:outline-none"
          />
        </div>

        {/* Nút submit */}
        <div className="flex justify-end mt-10">
          <button
            type="submit"
            disabled={loadingSubmit}
            className={`px-6 py-2 text-white transition rounded-full bg-blue hover:opacity-90 ${loadingSubmit ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loadingSubmit ? 'Đang lưu...' : 'Lưu lại'}
          </button>
        </div>
      </section>
    </form>
  )
}

export default EmployerInfo
