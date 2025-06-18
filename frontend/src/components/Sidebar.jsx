import React, { useRef, useContext } from 'react'
import { Routes, useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { ROUTES } from '../routes/routePaths'
import apiFetch from '../services/api'
import {
  ArchiveBoxIcon,
  ArrowUpCircleIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  HeartIcon,
  UserIcon,
  ShieldCheckIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { HandRaisedIcon } from '@heroicons/react/24/solid'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { user, updateTimestamp } = useContext(UserContext)

  const handleAvatarClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('avatar', file)

      try {
        await apiFetch('/account/avatar', 'PUT', formData)
        updateTimestamp()
      } catch (err) {
        console.error('Lỗi khi upload avatar:', err)
      }
    }
  }

  const menuItems = [
    { path: ROUTES.SET_INFORMATION, icon: <UserIcon className='w-6 h-6' />, label: 'Thông tin cá nhân' },
    { path: ROUTES.NOTIFY, icon: <BellIcon className='w-6 h-6' />, label: 'Thông báo' },
    ...(user.role === 'student' ? [
      { path: ROUTES.CV_MANAGER, icon: <DocumentTextIcon className='w-6 h-6' />, label: 'CV của tôi' }
    ] : []),
    { path: ROUTES.JOB_MANAGER, icon: <ArrowUpCircleIcon className="w-6 h-6" />, label: 'Dự án đã đăng' },
    { path: ROUTES.SAVED_JOB, icon: <HeartIcon className='w-6 h-6' />, label: 'Việc làm đã lưu' },

    ...(user.role === 'student' ? [
      { path: ROUTES.APPLIED_JOB, icon: <BriefcaseIcon className='w-6 h-6' />, label: 'Việc làm đã ứng tuyển' }
    ] : []),

    ...(user.role === 'student' ? [
      { path: ROUTES.JOB_INVITES, icon: <ArchiveBoxIcon className='w-6 h-6' />, label: 'Lời mời công việc' }
    ] : []),
    { path: ROUTES.SECURITY, icon: <ShieldCheckIcon className='w-6 h-6' />, label: 'Cài đặt Bảo mật' }
  ]

  return (
    <div className="w-full p-6 space-y-6 shadow-lg bg-white-low rounded-medium">
      <div className="flex items-center space-x-3">
        <div className="relative w-12 h-12 cursor-pointer" onClick={handleAvatarClick} >
          <img
            src={`${import.meta.env.VITE_API_URL}/account/avatar?timestamp=${user?.avatarTimestamp || ''}`}
            alt="Avatar"
            className="object-cover w-full h-full rounded-full"
          />
          <div className="absolute bottom-0 right-0 bg-white rounded-full p-[2px] shadow cursor-pointer">
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
          <div className="flex items-center gap-2">
            <HandRaisedIcon className='w-4 h-4 rotate-45 text-blue' />
            <p className="text-sm">Xin chào</p>
          </div>
          <p className="text-base font-bold">{user?.name || 'Vô danh'}</p>
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
