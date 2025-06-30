import React, { useState } from 'react'
import { AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline'
import RegisterForm from '../components/RegisterForm'

const options = [
  {
    value: 'employer',
    label: 'Tôi là nhà tuyển dụng',
    desc: 'Tìm ứng viên cho dự án của bạn',
    icon: <AcademicCapIcon className="w-10 h-10 mb-2" />
  },
  {
    value: 'student',
    label: 'Tôi là ứng viên',
    desc: 'Tìm việc làm, dự án phù hợp',
    icon: <BriefcaseIcon className="w-10 h-10 mb-2" />
  }
]

const Register = () => {
  const [selectedType, setSelectedType] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleContinue = () => {
    if (selectedType) setShowForm(true)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-[700px] px-6 py-10 text-center">
        {!showForm ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-semibold">
                Tham gia với tư cách khách hàng hoặc sinh viên
              </h1>
            </div>

            <div className="flex justify-center gap-8 mt-12">
              {options.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex flex-col items-center border-2 rounded-xl p-8 cursor-pointer transition
                    ${selectedType === opt.value ? 'border-blue-600 shadow-lg bg-white' : 'border-gray-300 bg-gray-50 hover:border-blue-400'}
                  `}
                >
                  {opt.icon}
                  <div className="mb-1 text-lg font-semibold">{opt.label}</div>
                  <div className="mb-3 text-gray-500">{opt.desc}</div>
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={selectedType === opt.value}
                    onChange={() => setSelectedType(opt.value)}
                    className="w-5 h-5 accent-blue-600"
                  />
                </label>
              ))}
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedType}
              className={`py-3 cursor-pointer rounded-md font-semibold text-white transition w-2/3 mt-6
                ${selectedType ? 'bg-blue hover:bg-blue-mid' : 'bg-gray-300 cursor-not-allowed'}
              `}
            >
              {selectedType === 'employer'
                ? 'Tham gia với tư cách Nhà tuyển dụng'
                : selectedType === 'student'
                  ? 'Ứng tuyển với tư cách Ứng viên'
                  : 'Tạo tài khoản'}
            </button>

            <p className="mt-4">
              Bạn đã có tài khoản?{' '}
              <a href="/login" className="underline text-blue">
                Đăng nhập
              </a>
            </p>
          </>
        ) : (
          <RegisterForm role={selectedType} onBack={() => setShowForm(false)} />
        )}
      </div>
    </div>
  )
}

export default Register
