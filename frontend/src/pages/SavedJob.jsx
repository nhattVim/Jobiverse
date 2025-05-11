import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

const SavedJob = () => {
  const [jobs, setJobs] = useState([
    {
      id: 'P001',
      title: 'Backend Developer (C#, .NET)',
      company: 'CodeLink',
      salary: 'Từ 2 - 4 triệu',
      location: 'TP Hồ Chí Minh',
      savedAt: '24/04/2025 - 08:31'
    },
    {
      id: 'P002',
      title: 'Frontend Developer (ReactJS)',
      company: 'ABC Corp',
      salary: 'Từ 3 - 6 triệu',
      location: 'Hà Nội',
      savedAt: '25/04/2025 - 09:00'
    },
    {
      id: 'P003',
      title: 'Mobile Developer (Flutter)',
      company: 'XYZ Ltd.',
      salary: 'Từ 4 - 7 triệu',
      location: 'Đà Nẵng',
      savedAt: '26/04/2025 - 14:00'
    }
  ])

  const handleDelete = (indexToRemove) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa công việc này?')
    if (confirmDelete) {
      const updatedJobs = jobs.filter((_, index) => index !== indexToRemove)
      setJobs(updatedJobs)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7ff] relative">
      <div className="bg-gradient-to-l from-blue-950 to-blue-800 text-white py-10 px-6 rounded-xl mx-4">
        <h1 className="text-4xl font-bold mb-2 text-center">Việc làm đã lưu</h1>
        <p className="text-sm max-w-xl mx-auto text-center">
          Xem lại danh sách những việc làm mà bạn đã lưu trước đó. Ứng tuyển ngay để không bỏ lỡ cơ hội nghề nghiệp dành cho bạn.
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex mt-6 px-6 gap-8 items-start">
        <div className="w-1/4 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 space-y-6">
          {jobs.length === 0 ? (
            <div className="text-center text-gray-500 text-sm">Bạn chưa lưu việc làm nào.</div>
          ) : (
            jobs.map((job, index) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl shadow flex items-center justify-between hover:shadow-md transition"
              >
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-[#d5f5f6] rounded-xl flex items-center justify-center">
                    <img
                      src="https://cdn-icons-png.freepik.com/256/17359/17359748.png"
                      alt="logo"
                      className="w-10 h-10"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#122269]">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company}</p>
                    <div className="flex items-center text-sm text-gray-600 space-x-2 mt-1">
                      <span>💰 {job.salary}</span>
                      <span>|</span>
                      <span>📍 {job.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-2">Đã lưu: {job.savedAt}</p>
                  <div className="flex space-x-3 justify-end">
                    <button
                      onClick={() => {}}
                      className="bg-[#3253C5] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1f3bbf]"
                    >
                      Ứng tuyển ngay ↗
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      title="Xóa"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition duration-200 shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7L5 7M10 11V17M14 11V17M5 7L6 19C6 20.105 6.895 21 8 21H16C17.105 21 18 20.105 18 19L19 7M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default SavedJob
