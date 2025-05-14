import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import BannerText from '../components/BannerText'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import apiFetch from '../services/api'
import { InboxStackIcon, MapPinIcon } from '@heroicons/react/24/outline'

const SavedJob = () => {
  const [favoriteJobs, setFavoriteJobs] = useState([])

  useEffect(() => {
    const fetchFavoriteJobs = async () => {
      try {
        const data = await apiFetch('/favorites', 'GET')
        setFavoriteJobs(data)
      } catch (err) {
        console.log('Error fetch favorite job', err.message)
      }
    }

    fetchFavoriteJobs()
  }, [])

  const handleDelete = async (projectId) => {
    try {
      await apiFetch(`/favorites/${projectId}`, 'DELETE')
      setFavoriteJobs((prevJobs) => prevJobs.filter((job) => job.project._id !== projectId))
    } catch (err) {
      console.log('Cannot delete favorite job', err.message)
    }
  }

  return (
    <div className="min-h-screen relative">
      <BannerText title="Việc làm đã lưu" caption="Xem lại danh sách những việc làm mà bạn đã lưu trước đó. Ứng tuyển ngay để không bỏ lỡ cơ hội nghề nghiệp dành cho bạn."/>

      <div className="max-w-7xl mx-auto flex px-6 py-20 gap-16 items-start">
        <div className="w-1/4 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 space-y-6">
          {favoriteJobs.length === 0 ? (
            <div className="text-center text-gray-500 text-sm">Bạn chưa lưu việc làm nào.</div>
          ) : (
            favoriteJobs.map((job, index) => (
              <div
                key={index}
                className="bg-white-mid p-6 rounded-medium shadow flex items-center justify-between hover:shadow-md transition"
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
                    <h3 className="font-semibold text-[22px]">{job.project.title}</h3>
                    <p className="text-black-low mt-2.5">{job.project.content}</p>
                    <div className="flex items-center text-black-low space-x-2 mt-2.5">
                      <span className='flex gap-2 items-center'><InboxStackIcon className='text-blue w-6 h-6'/> {job.project.status}</span>
                      <span>|</span>
                      <span><MapPinIcon className='text-blue w-6 h-6'/> {job.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between h-full text-right gap-5">
                  <p className="text-sm text-black-low">Đã lưu: {new Date(job.createdAt).toLocaleDateString()}</p>
                  <div className="flex items-center space-x-3 justify-end">
                    <ButtonArrowOne>Ứng tuyển</ButtonArrowOne>
                    <button
                      onClick={() => handleDelete(job.project._id)}
                      title="Xóa"
                      className="w-[46px] h-[46px] flex items-center justify-center rounded-full bg-red hover:bg-red-600 text-white transition duration-300 shadow-md cursor-pointer"
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
