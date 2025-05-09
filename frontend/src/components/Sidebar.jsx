import React, { useRef, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [avatar, setAvatar] = useState('https://cdn-icons-png.flaticon.com/512/3135/3135715.png')
  const [userName, setUserName] = useState('Người dùng')

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    if (userData && userData.name) {
      setUserName(userData.name)
    }
  }, [])

  const handleAvatarClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setAvatar(imageUrl)
    }
  }

  const menuItems = [
    { path: '/set-infomation', label: '🔍 Thông tin cá nhân' }, //Để đúng cái tên page
    { path: '/cv-management', label: '📄 CV của tôi' },
    { path: '/saved-job', label: '🤍 Việc làm đã lưu' },
    { path: '/applied-jobs', label: '📤 Việc làm đã ứng tuyển' },
    { path: '/job-invites', label: '📬 Lời mời công việc' }
  ]

  return (
    <div className="w-full bg-white-low rounded-medium shadow-lg p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="relative w-12 h-12">
          <img src={avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          <div
            className="absolute bottom-0 right-0 bg-white rounded-full p-[2px] shadow cursor-pointer"
            onClick={handleAvatarClick}
          >
            <img
              src="https://cdn-icons-png.freepik.com/256/4265/4265710.png"
              alt="Camera"
              className="w-3 h-3"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500">Xin chào</p>
          <p className="font-bold text-base">{userName}</p>
        </div>
      </div>

      <div className="space-y-3">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`w-full text-left px-5 py-2 rounded-full flex items-center gap-2 
              ${location.pathname === item.path ? 'bg-blue text-white font-semibold' : 'hover:bg-gray-100'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
