import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useNavigate, Link } from 'react-router-dom'
import apiFetch from '../services/api'
import BannerText from '../components/BannerText'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

const CVManagement = () => {
  const [cvList, setCvList] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const created = await apiFetch('/cv', 'GET')
        setCvList(created)
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu CV:', err)
      }
      finally {
        setLoading(false)
      }
    }
    fetchCVs()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá CV này?')) return

    try {
      await apiFetch(`/cv/${id}`, 'DELETE')
      setCvList(cvList.filter(cv => cv._id !== id))
    } catch (err) {
      alert('Xoá thất bại: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen">
      <BannerText title="CV của tôi" caption="Tải CV của bạn bên dưới để có thể sử dụng xuyên suốt quá trình tìm việc." />

      <div className="flex items-start gap-16 px-6 py-20 mx-auto max-w-7xl">
        <div className="flex-shrink-0 w-1/4">
          <Sidebar />
        </div>

        <div className="w-3/4 space-y-10">
          {/* CV đã tạo */}
          <div className="flex items-center justify-between p-6 shadow bg-white-low rounded-medium">
            <div className="flex items-center w-full space-x-4">
              {
                cvList.length > 0 ? <div></div> :
                  <img src="https://cdn-icons-png.freepik.com/256/11959/11959483.png?semt=ais_hybrid"
                    alt="cv"
                    className="w-16 h-16"
                  />
              }
              <div className='w-full space-y-1.5'>
                <div className='flex items-center justify-between'>
                  <h2 className="text-lg font-semibold">CV đã tạo trên Jobiverse</h2>
                  <button
                    onClick={() => navigate('/cv')}
                    className="px-5 py-2 text-sm text-white rounded-full cursor-pointer bg-blue hover:bg-blue-700"
                  >
                    + Tạo mới
                  </button>
                </div>

                {loading ? (
                  <p>Đang tải...</p>
                ) : (
                  cvList.length === 0 ? (
                    <p className="text-sm text-gray-500">Bạn chưa tạo CV nào</p>
                  ) : (
                    cvList.map(cv => (
                      <div
                        key={cv._id}
                        className="bg-white-mid flex items-center justify-between p-6 my-5 transition border border-gray-light rounded-medium hover:shadow-md hover:bg-gray-50"
                      >
                        <div>
                          <Link
                            to={`/cv/${cv._id}`}
                            className="block mb-1 text-lg font-semibold text-blue-mid hover:underline"
                          >
                            {cv.title || 'Chưa đặt tên'}
                          </Link>
                          <p className="text-sm italic text-gray-500">
                            {cv.desiredPosition || 'Chưa có vị trí ứng tuyển'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/cv/${cv._id}`)}
                            className="px-4 py-1.5 text-sm text-white bg-green-600 rounded-full hover:bg-green-700 transition cursor-pointer"
                          >
                            <PencilSquareIcon className='w-5 h-5'/>
                          </button>
                          <button
                            onClick={() => handleDelete(cv._id)}
                            className="px-4 py-1.5 text-sm text-white bg-red-600 rounded-full hover:bg-red-700 transition cursor-pointer"
                          >
                            <TrashIcon className='w-5 h-5'/>
                          </button>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>
          </div>

          {/* CV đã tải lên */}
          <div className="flex items-center justify-between p-6 shadow bg-white-low rounded-medium">
            <div className="flex items-center space-x-4">
              <img
                src="https://cdn-icons-png.freepik.com/256/11959/11959483.png?semt=ais_hybrid"
                alt="uploaded cv"
                className="w-16 h-16"
              />
              <div>
                <h2 className="text-lg font-semibold">CV đã tải lên Jobiverse</h2>
                <p className="text-sm text-gray-500">Bạn chưa tải lên CV nào</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/upload-cv')}
              className="px-5 py-2 text-sm rounded-full cursor-pointer bg-blue hover:bg-blue-700 text-white-bright"
            >
              ⬆ Tải CV lên
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CVManagement
