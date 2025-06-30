import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import BannerText from '../components/BannerText'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import apiFetch from '../services/api'
import { CurrencyDollarIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import { formatDateTime } from '../utils/dateTimeUtils'

const SavedJob = () => {
  const [favoriteJobs, setFavoriteJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFavoriteJobs = async () => {
      try {
        const data = await apiFetch('/favorites', 'GET')
        setFavoriteJobs(data)
      } catch (err) {
        console.log('Error fetch favorite job', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFavoriteJobs()
  }, [])

  const handleDelete = async (projectId) => {
    try {
      await apiFetch(`/favorites/${projectId}`, 'DELETE')
      setFavoriteJobs((prevJobs) =>
        prevJobs.filter((job) => job.project._id !== projectId)
      )
    } catch (err) {
      console.log('Cannot delete favorite job', err.message)
    }
  }
  console.log(favoriteJobs)

  return (
    <div className="relative min-h-screen">
      <BannerText
        title="Việc làm đã lưu"
        caption="Xem lại danh sách những việc làm mà bạn đã lưu trước đó. Ứng tuyển ngay để không bỏ lỡ cơ hội nghề nghiệp dành cho bạn."
      />

      <div className="flex items-start gap-16 px-6 py-20 mx-auto max-w-7xl">
        <div className="flex-shrink-0 w-1/4">
          <Sidebar />
        </div>
        {loading ? (
          <div className="flex items-center justify-center w-full h-60">
            <p className="text-lg text-gray-500">Đang tải việc làm...</p>
          </div>
        ) : (
          <div className="flex-1 space-y-6">
            {favoriteJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-5 py-6 bg-white-low rounded-medium">
                <h2 className="w-full text-xl font-semibold text-left pl-6">
                  Việc làm đã lưu
                </h2>
                <img
                  src="https://cdn-icons-png.freepik.com/256/10488/10488851.png?uid=P110270408&ga=GA1.1.1066839565.1745722550&semt=ais_incoming"
                  alt="job"
                  className="w-20"
                />
                <p className="text-gray-500 text-center">
                  Bạn chưa lưu việc làm nào
                </p>
                <button
                  onClick={() => navigate('/job-list')}
                  className="px-5 py-2 text-sm text-white rounded-full cursor-pointer bg-blue hover:bg-blue-700"
                >
                  Tìm việc ngay
                </button>
              </div>
            ) : (
              favoriteJobs.map((job, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-6 transition shadow bg-white-mid rounded-medium hover:shadow-md"
                >
                  <div className="flex items-center space-x-5">
                    <div className="w-[70px] h-[70px] bg-white border border-white-low rounded-small flex justify-center items-center">
                      <img
                        src={`data:image/png;base64,${job.project?.account?.avatar?.data}`}
                        alt="imgcompany"
                        className="object-cover w-10 h-10 rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[22px]">
                        <Link
                          to={`/job-detail/${job.project?._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[22px] font-semibold leading-[28.6px] line-clamp-1 hover:text-blue transition-colors duration-300"
                        >
                          {job.project?.title}
                        </Link>
                      </h3>
                      <p className="text-black-low mt-2.5">
                        {job.project?.profile?.name ||
                          job.project?.profile?.companyName}
                      </p>
                      <div className="flex items-center text-black-low space-x-2 mt-2.5">
                        <span className="flex gap-2 items-center">
                          <CurrencyDollarIcon className="text-blue w-6 h-6" />
                          {job.project?.salary}
                        </span>
                        <span>|</span>
                        <span className="flex gap-2 items-cente">
                          <MapPinIcon className="text-blue w-6 h-6" />
                          {job.project?.location?.province}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between h-full text-right gap-5">
                    <p className="text-sm text-black-low">
                      Đã lưu: {formatDateTime(job.createdAt)}
                    </p>
                    <div className="flex items-center space-x-3 justify-end">
                      <ButtonArrowOne>Ứng tuyển</ButtonArrowOne>
                      <button
                        onClick={() => handleDelete(job.project._id)}
                        title="Xóa"
                        className="w-[46px] h-[46px] flex items-center justify-center rounded-full bg-red hover:bg-red-600 text-white transition duration-300 shadow-md cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7L5 7M10 11V17M14 11V17M5 7L6 19C6 20.105 6.895 21 8 21H16C17.105 21 18 20.105 18 19L19 7M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedJob
