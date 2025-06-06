import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useNavigate, Link } from 'react-router-dom'
import apiFetch from '../services/api'
import BannerText from '../components/BannerText'
import { ToastContainer, toast } from 'react-toastify'
import {
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

const CVManagement = () => {
  const [cvList, setCvList] = useState([])
  const [cvUploads, setCvUploads] = useState([])
  const [cvUploadLoading, setCvUploadLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const [created, uploads] = await Promise.all([
        apiFetch('/cv', 'GET'),
        apiFetch('/cv/uploads', 'GET')
      ])
      setCvList(created)
      setCvUploads(uploads)
      setLoading(false)
      setCvUploadLoading(false)
    }
    loadData()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá CV này?')) return

    try {
      await apiFetch(`/cv/${id}`, 'DELETE')
      setCvList(cvList.filter(cv => cv._id !== id))
      toast.success('Xoá thành công')
    } catch (err) {
      alert('Xoá thất bại: ' + err.message)
      toast.error('Xoá thất bại: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <BannerText title="CV của tôi" caption="Tải CV của bạn bên dưới để có thể sử dụng xuyên suốt quá trình tìm việc." />

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
                  <h2 className="text-xl font-semibold">CV đã tạo trên Jobiverse</h2>
                </div>
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
                  <div className="flex flex-col items-center justify-center gap-5 py-5">
                    <img src="https://cdn-icons-png.freepik.com/256/10488/10488619.png?uid=R110270408&ga=GA1.1.1066839565.1745722550"
                      alt="job"
                      className="w-20"
                    />
                    <p className="text-gray-500 text-center">Bạn chưa tạo cv nào</p>
                  </div>
                ) : (
                  cvList.map(cv => (
                    <div
                      key={cv._id}
                      className="flex items-center justify-between p-6 my-5 transition border shadow bg-white-mid border-gray-light rounded-medium hover:shadow-md hover:bg-gray-50"
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
                          <PencilSquareIcon className='w-5 h-5' />
                        </button>
                        <button
                          onClick={() => handleDelete(cv._id)}
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

          {/* CV đã tải lên */}
          <div className="flex items-center justify-between p-6 shadow bg-white-low rounded-medium">
            <div className='w-full space-y-1.5'>
              <div className="flex items-center justify-between">
                <div className='flex items-center space-x-4'>
                  <img
                    src="https://cdn-icons-png.freepik.com/256/11959/11959483.png?semt=ais_hybrid"
                    alt="uploaded cv"
                    className="w-16 h-16"
                  />
                  <h2 className="text-lg font-semibold">CV đã tải lên Jobiverse</h2>
                </div>

                <button
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.pdf, .doc, .docx'
                    input.multiple = true
                    input.onchange = async (e) => {
                      const files = Array.from(e.target.files)
                      const formData = new FormData()
                      files.forEach(file => formData.append('files', file))
                      setCvUploadLoading(true)
                      try {
                        await apiFetch('/cv/uploads', 'POST', formData)
                        alert('Tải lên thành công!')
                        const updatedUploads = await apiFetch('/cv/uploads', 'GET')
                        setCvUploads(updatedUploads)
                      } catch (err) {
                        alert('Tải lên thất bại: ' + err.message)
                      } finally {
                        setCvUploadLoading(false)
                      }
                    }

                    input.click()
                  }}
                  className="px-5 py-2 text-sm rounded-full cursor-pointer bg-blue hover:bg-blue-700 text-white-bright"
                >
                  ⬆ Tải CV lên
                </button>
              </div>

              {cvUploadLoading ? (
                <p>Đang tải...</p>
              ) : (
                cvUploads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-5 py-5">
                    <img src="https://cdn-icons-png.freepik.com/256/10488/10488619.png?uid=R110270408&ga=GA1.1.1066839565.1745722550"
                      alt="job"
                      className="w-20"
                    />
                    <p className="text-gray-500 text-center">Bạn chưa tải lên cv nào</p>
                  </div>
                ) : (
                  cvUploads.map(cv => (
                    <div key={cv._id} className='flex items-center justify-between p-6 my-5 transition border bg-white-mid border-gray-light rounded-medium hover:shadow-md hover:bg-gray-50'>
                      <a
                        href={`${import.meta.env.VITE_API_URL}/cv/uploads/${cv._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className='block mb-1 text-lg font-semibold text-blue-mid hover:underline'
                      >
                        {cv.title}
                      </a>
                      <div className="flex items-center space-x-2">
                        <a
                          href={`${import.meta.env.VITE_API_URL}/cv/uploads/${cv._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center px-4 py-1.5 text-white bg-blue-600 rounded-full hover:bg-blue-700"
                        >
                          <ArrowDownTrayIcon className="w-5 h-5" />
                        </a>

                        <button
                          onClick={async () => {
                            const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa CV này không?')
                            if (!confirmDelete) return
                            await apiFetch(`/cv/uploads/${cv._id}`, 'DELETE')
                            setCvUploads(prev => prev.filter(item => item._id !== cv._id))
                          }}
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
  )
}

export default CVManagement
