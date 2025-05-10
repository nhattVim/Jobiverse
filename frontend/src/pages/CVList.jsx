import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiFetch from '../services/api'

export default function CVList() {
  const [cvList, setCvList] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiFetch('/cv', 'GET')
        setCvList(data)
      } catch (err) {
        console.error('Failed to fetch CVs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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
    <div className="flex flex-col gap-6 p-6 mx-auto md:flex-row max-w-7xl">
      {/* Bên trái: danh sách CV */}
      <div className="w-full h-screen md:w-2/3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Danh sách CV</h1>
          <button
            onClick={() => navigate('/cv')}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            + Tạo CV mới
          </button>
        </div>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="space-y-4">
            {cvList.length === 0 ? (
              <p>Chưa có CV nào.</p>
            ) : (
              cvList.map(cv => (
                <div
                  key={cv._id}
                  className="flex items-center justify-between p-4 border rounded shadow-sm hover:shadow"
                >
                  <div>
                    <p className="font-semibold">{cv.title || 'Chưa đặt tên'}</p>
                    <p className="text-sm italic text-gray-600">
                      {cv.desiredPosition || 'Chưa có vị trí ứng tuyển'}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => navigate(`/cv/${cv._id}`)}
                      className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Xem/Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(cv._id)}
                      className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bên phải: việc làm gợi ý */}
      <div className="w-full p-4 border rounded shadow md:w-1/3 bg-gray-50">
        <h2 className="mb-2 text-xl font-semibold">Việc làm phù hợp với bạn</h2>
        <ul className="space-y-3">
          <li className="p-3 border rounded cursor-pointer hover:bg-gray-100">
            <p className="font-medium">Frontend Developer tại ABC Corp</p>
            <p className="text-sm text-gray-600">React, Tailwind, 12 triệu</p>
          </li>
          <li className="p-3 border rounded cursor-pointer hover:bg-gray-100">
            <p className="font-medium">Backend Node.js tại XYZ Ltd</p>
            <p className="text-sm text-gray-600">Node.js, MongoDB, 15 triệu</p>
          </li>
        </ul>
      </div>
    </div>
  )
}
