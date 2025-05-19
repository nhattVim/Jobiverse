import React, { useRef, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes/routePaths'
import apiFetch from '../services/api'
import { ArchiveBoxIcon, BriefcaseIcon, DocumentTextIcon, HeartIcon, UserIcon } from '@heroicons/react/24/outline'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [avatar, setAvatar] = useState('http://localhost:3000/account/avatar')
  const [userName, setUserName] = useState('Người dùng')

  const fetchAvatar = async () => {
    try {
      const response = await apiFetch('/account/avatar', 'GET')
      const imageUrl = URL.createObjectURL(response)
      setAvatar(imageUrl)
    } catch (err) {
      console.error('Không thể lấy avatar:', err)
    }
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    if (userData?.name) setUserName(userData.name)
    fetchAvatar()
  }, [])

  const handleAvatarClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('avatar', file)

      try {
        await apiFetch('/students', 'POST', formData)
        await fetchAvatar()
      } catch (err) {
        console.error('Lỗi khi upload avatar:', err)
      }
    }
  }

  const menuItems = [
    { path: ROUTES.SET_INFORMATION, icon: <UserIcon className='w-6 h-6' />, label: 'Thông tin cá nhân' },
    { path: ROUTES.CV_MANAGER, icon: <DocumentTextIcon className='w-6 h-6' />, label: 'CV của tôi' },
    { path: ROUTES.SAVED_JOB, icon: <HeartIcon className='w-6 h-6' />, label: 'Việc làm đã lưu' },
    { path: '/applied-jobs', icon: <BriefcaseIcon className='w-6 h-6' />, label: 'Việc làm đã ứng tuyển' },
    { path: '/job-invites', icon: <ArchiveBoxIcon className='w-6 h-6' />, label: 'Lời mời công việc' }
  ]

  return (
    <div className="w-full p-6 space-y-6 shadow-lg bg-white-low rounded-medium">
      <div className="flex items-center space-x-3">
        <div className="relative w-12 h-12">
          <img src={avatar} alt="Avatar" className="object-cover w-full h-full rounded-full" />
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
          <p className="text-base font-bold">{userName}</p>
        </div>
      </div>

      <div className="space-y-3">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`w-full text-left px-5 py-3 rounded-full flex items-center gap-2
              ${location.pathname === item.path ? 'bg-blue text-white font-semibold' : 'hover:bg-gray-100'} cursor-pointer`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
