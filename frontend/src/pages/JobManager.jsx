import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import apiFetch from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import BannerText from '../components/BannerText'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

const JobManager = () => {
  const [jobList, setJobList] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const data = await apiFetch('/projects/my', 'GET')
      setJobList(data)
      setLoading(false)
    }
    loadData()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá CV này?')) return

    try {
      await apiFetch(`/projects/my/${id}`, 'DELETE')
      setJobList(jobList.filter(job => job._id !== id))
      toast.success('Xoá thành công')
    } catch (err) {
      alert('Xoá thất bại: ' + err.message)
      toast.error('Xoá thất bại')
    }
  }

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <BannerText
        title="Thông tin cá nhân"
        caption="Hồ sơ ấn tượng bắt đầu từ những thông tin cá nhân đầy đủ và rõ ràng. Cập nhật chính xác để nhà tuyển dụng có thể dễ dàng kết nối và hiểu rõ tiềm năng của bạn."
      />

      <div className="flex items-start gap-16 px-6 py-20 mx-auto max-w-7xl">
        <div className="flex-shrink-0 w-1/4">
          <Sidebar />
        </div>
        <div className="w-3/4 space-y-10">
          {/* CV đã tạo */}
          <div className="flex items-center justify-between p-6 shadow bg-white-low rounded-medium">
            <div className='w-full space-y-1.5'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <img src="https://cdn-icons-png.freepik.com/256/11959/11959483.png?semt=ais_hybrid"
                    alt="cv"
                    className="w-16 h-16"
                  />
                  <h2 className="text-lg font-semibold">Dự án đã tạo trên Jobiverse</h2>
                </div>
                <button
                  onClick={() => navigate('/job-post')}
                  className="px-5 py-2 text-sm text-white rounded-full cursor-pointer bg-blue hover:bg-blue-700"
                >
                  + Tạo mới
                </button>
              </div>

              <div className="flex-1">
                {loading ? (
                  <div className="flex items-center justify-center w-full h-full p-10">
                    <p>Đang tải dữ liệu...</p>
                  </div>
                ) : (
                  jobList.length === 0 ? (
                    <p className="text-sm text-gray-500">Bạn chưa tạo dự án nào</p>
                  ) : (
                    jobList.map(job => (
                      <div
                        key={job._id}
                        className="flex items-center justify-between p-6 my-5 transition border shadow bg-white-mid border-gray-light rounded-medium hover:shadow-md hover:bg-gray-50"
                      >

                        <div>
                          <Link
                            to={`/job-detail/${job._id}`}
                            className="block mb-1 text-lg font-semibold text-blue-mid hover:underline"
                          >
                            {job.title || 'Không có tiêu đề'}
                          </Link>
                          <p className="text-sm italic text-gray-500">
                            {job.description || 'Chưa có mô tả'}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/job-detail/${job._id}`)}
                            className="px-4 py-1.5 text-sm text-white bg-green-600 rounded-full hover:bg-green-700 transition cursor-pointer"
                          >
                            <PencilSquareIcon className='w-5 h-5' />
                          </button>

                          <button
                            onClick={() => handleDelete(job._id)}
                            className="px-4 py-1.5 text-sm text-white bg-red-600 rounded-full hover:bg-red-700 transition cursor-pointer"
                          >
                            <TrashIcon className='w-5 h-5' />
                          </button>
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

export default JobManager
