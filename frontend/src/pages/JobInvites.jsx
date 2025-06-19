import React, { useState, useEffect, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import apiFetch from '../services/api'
import BannerText from '../components/BannerText'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CurrencyDollarIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { formatDateTime } from '../utils/dateTimeUtils'

const JobInvites = () => {
  const [jobList, setJobList] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    const data = await apiFetch('/projects/invitations', 'GET')
    setJobList(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleInviteResponse = async (jobId, action) => {
    try {
      await apiFetch(`/projects/invitations/${jobId}/${action}`, 'POST')
      toast.success(`Bạn đã ${action === 'accept' ? 'chấp nhận' : 'từ chối'} lời mời thành công!`)
      loadData()
    } catch (error) {
      console.error('Error handling invite response:', error)
      toast.error('Đã có lỗi xảy ra, vui lòng thử lại!')
    }
  }

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <BannerText
        title="Lời mời công việc"
        caption="Cơ hội vàng đang chờ đón bạn. Hãy tự tin nắm bắt công việc mơ ước với lời mời hấp dẫn này. Bắt đầu hành trình sự nghiệp mới ngay hôm nay."
      />

      <div className="flex items-start gap-16 px-6 py-20 mx-auto max-w-7xl">
        <div className="flex-shrink-0 w-1/4">
          <Sidebar />
        </div>

        <div className="w-3/4 space-y-10">
          <div className="flex items-center justify-between p-6 shadow bg-white-low rounded-medium">
            <div className='w-full space-y-1.5'>
              <div className='flex items-center space-x-4'>
                <img src="https://cdn-icons-png.freepik.com/256/11959/11959478.png?uid=R110270408&ga=GA1.1.1066839565.1745722550"
                  alt="job"
                  className="w-16 h-16"
                />
                <h2 className="text-xl font-semibold">Lời mời công việc</h2>
              </div>

              <div className="flex-1">
                {loading ? (
                  <div className="flex items-center justify-center w-full h-full p-10">
                    <p>Đang tải dữ liệu...</p>
                  </div>
                ) : (
                  jobList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-5 py-5">
                      <img src="https://cdn-icons-png.freepik.com/256/10488/10488851.png?uid=P110270408&ga=GA1.1.1066839565.1745722550&semt=ais_incoming"
                        alt="job"
                        className="w-20"
                      />
                      <p className="text-center text-gray-500">Bạn chưa được mời vào dự án nào.</p>
                    </div>
                  ) : (
                    jobList.map(job => (
                      <div
                        key={job._id}
                        className="flex items-center justify-between p-6 my-5 transition border shadow bg-white-mid border-gray-light rounded-medium hover:shadow-md hover:bg-gray-50"
                      >

                        <div className="flex items-center space-x-5">
                          <div className="w-[70px] h-[70px] bg-white border border-white-low rounded-small flex justify-center items-center">
                            <img
                              src={`data:image/png;base64,${job.account?.avatar?.data}`}
                              alt="imgcompany"
                              className="object-cover w-10 h-10 rounded-full"
                            />
                          </div>

                          <div>
                            <Link
                              to={`/job-detail/${job._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[22px] font-semibold leading-[28.6px] line-clamp-1 hover:text-blue transition-colors duration-300"
                            >
                              {job.title}
                            </Link>
                            <p className="text-black-low mt-2.5">
                              {job.profile?.name || job.profile?.companyName}
                            </p>
                            <div className="flex items-center text-black-low space-x-2 mt-2.5">
                              <span className="flex items-center gap-2">
                                <CurrencyDollarIcon className="w-6 h-6 text-blue" />
                                {job.salary}
                              </span>
                              <span>|</span>
                              <span className="flex gap-2 items-cente">
                                <MapPinIcon className="w-6 h-6 text-blue" />
                                {job.location?.province}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className='flex flex-col items-end space-y-10'>
                          <p className="text-sm text-black-low">
                            Được mời:{' '}
                            <span>{formatDateTime(job.applicants[0].appliedAt)}</span>
                          </p>
                          <div className="flex items-center space-x-2">
                            <button
                              className="px-4 py-1.5 text-sm text-white bg-green-600 rounded-full hover:bg-green-700 transition cursor-pointer"
                              onClick={() => handleInviteResponse(job._id, 'accept')}
                            >
                              Chấp nhận
                            </button>

                            <button
                              className="px-4 py-1.5 text-sm text-white bg-red-600 rounded-full hover:bg-red-700 transition cursor-pointer"
                              onClick={() => handleInviteResponse(job._id, 'reject')}
                            >
                              Từ chối
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobInvites
