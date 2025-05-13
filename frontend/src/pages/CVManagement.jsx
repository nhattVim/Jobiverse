import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import apiFetch from '../services/api'
import BannerText from '../components/BannerText'

const CVManagement = () => {
  const navigate = useNavigate()
  const [createdCVs, setCreatedCVs] = useState([])
  const [uploadedCVs, setUploadedCVs] = useState([])

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const created = await apiFetch('/cv/created', 'GET')
        const uploaded = await apiFetch('/cv/uploaded', 'GET')
        setCreatedCVs(created)
        setUploadedCVs(uploaded)
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu CV:', err)
      }
    }
    fetchCVs()
  }, [])

  const handleCreateCV = () => {
    navigate('/cv')
  }

  const handleUploadCV = () => {
    navigate('/upload-cv')
  }

  return (
    <div className="min-h-screen">
      <BannerText title="CV của tôi" caption="Tải CV của bạn bên dưới để có thể sử dụng xuyên suốt quá trình tìm việc."/>

      <div className="max-w-7xl mx-auto flex py-20 px-6 gap-16 items-start">
        <div className="w-1/4 flex-shrink-0">
          <Sidebar />
        </div>

        <div className="w-3/4 space-y-10">
          {/* CV đã tạo */}
          <div className="bg-white-low rounded-medium shadow p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://cdn-icons-png.freepik.com/256/11959/11959483.png?semt=ais_hybrid"
                alt="cv"
                className="w-16 h-16"
              />
              <div>
                <h2 className="font-semibold text-lg">CV đã tạo trên Jobiverse</h2>
                <br />
                {createdCVs.length > 0 ? (
                  <ul className="text-sm text-gray-600 list-disc ml-4">
                    {createdCVs.map((cv) => (
                      <li key={cv.id}>
                        <a
                          href={cv.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {cv.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Bạn chưa tạo CV nào</p>
                )}
              </div>
            </div>
            <button
              onClick={handleCreateCV}
              className="bg-blue hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm cursor-pointer"
            >
              + Tạo mới
            </button>
          </div>

          {/* CV đã tải lên */}
          <div className="bg-white-low rounded-medium shadow p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://cdn-icons-png.freepik.com/256/11959/11959483.png?semt=ais_hybrid"
                alt="uploaded cv"
                className="w-16 h-16"
              />
              <div>
                <h2 className="font-semibold text-lg">CV đã tải lên Jobiverse</h2>
                <br />
                {uploadedCVs.length > 0 ? (
                  <ul className="text-sm text-gray-600 list-disc ml-4">
                    {uploadedCVs.map((cv) => (
                      <li key={cv.id}>
                        <a
                          href={cv.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {cv.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Bạn chưa tải lên CV nào</p>
                )}
              </div>
            </div>
            <button
              onClick={handleUploadCV}
              className="bg-blue hover:bg-blue-700 text-white-bright px-5 py-2 rounded-full text-sm cursor-pointer"
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
