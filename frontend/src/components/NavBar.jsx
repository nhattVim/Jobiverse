import React, { useEffect, useState, useContext } from 'react'
import Logo2 from '../assets/Logo2.svg'
import { Link, useNavigate } from 'react-router-dom'
import {
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon
} from '@heroicons/react/24/solid'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import { ROUTES } from '../routes/routePaths'
import apiFetch from '../services/api'
import { UserContext } from '../contexts/UserContext'

const MenuItem = ({ to, children, hidden }) => (
  <li className="px-4 py-2.5 transition-colors duration-300 hover:text-blue items-center flex justify-start" hidden={hidden}>
    <Link to={to}>{children}</Link>
  </li>
)

const DropdownMenu = ({ items, className }) => (
  <div className={`absolute z-40 top-full ${className}`}>
    <ul className="grid grid-cols-2 p-5 mt-6 transition-all duration-500 shadow-md animate-slideUp bg-white-bright rounded-small">
      {items.map(({ label, to, hidden }, idx) => (
        <MenuItem key={idx} to={to} hidden={hidden}>{label}</MenuItem>
      ))}
    </ul>
  </div>
)

const NavBar = () => {
  const navigate = useNavigate()
  const [isTopOfPage, setIsTopOfPage] = useState(true)
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [notiCount, setNotiCount] = useState(0)
  const { user } = useContext(UserContext)

  useEffect(() => {
    const handleScroll = () => setIsTopOfPage(window.scrollY === 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (user) setIsLoggedIn(true)
  }, [user])

  useEffect(() => {
    if (!user) return

    let intervalId

    const fetchNotifications = async () => {
      try {
        const res = await apiFetch('/notify/unread-count', 'GET')
        setNotiCount(res.unreadCount)
      } catch (err) {
        console.error('Fetch error:', err)
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNotifications()
        intervalId = setInterval(fetchNotifications, 5000)
      } else {
        clearInterval(intervalId)
      }
    }

    fetchNotifications()
    intervalId = setInterval(fetchNotifications, 5000)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user])

  const handleLogout = async () => {
    try {
      await apiFetch('/logout', 'POST')
      localStorage.removeItem('user')
      setIsLoggedIn(false)
      navigate(ROUTES.LOGIN)
    } catch (error) {
      console.log('Đăng xuất thất bại', error)
    }
  }

  const navbarStyle = isTopOfPage
    ? 'py-5'
    : 'fixed top-0 left-0 z-40 py-2 drop-shadow animate-slideDown'

  const jobMenuItems = [
    { label: 'Danh sách việc làm', to: ROUTES.JOB_LIST },
    { label: 'Việc làm đã lưu', to: ROUTES.SAVED_JOB },
    { label: 'Việc làm đã ứng tuyển', to: ROUTES.APPLIED_JOB, hidden: user?.role !== 'student' },
    { label: 'Đăng việc làm', to: ROUTES.CREATE_JOB }
  ]

  const cvMenuItems = [
    { label: 'Quản lý CV', to: ROUTES.CV_MANAGER },
    { label: 'Tạo CV mới', to: ROUTES.CREATE_CV },
    { label: 'Upload CV', to: ROUTES.UPLOAD_CV }
  ]

  const accountMenuItems = [
    { label: 'Thông tin cá nhân', to: ROUTES.SET_INFORMATION },
    { label: 'CV của tôi', to: ROUTES.CV_MANAGER, hidden: user?.role !== 'student' },
    { label: 'Dự án đã đăng', to: ROUTES.JOB_MANAGER },
    { label: 'Việc làm đã lưu', to: ROUTES.SAVED_JOB },
    { label: 'Lời mời công việc', to: ROUTES.JOB_INVITES, hidden: user?.role !== 'student' },
    { label: 'Việc làm đã ứng tuyển', to: ROUTES.APPLIED_JOB, hidden: user?.role !== 'student' },
    { label: 'Cài đặt bảo mật', to: ROUTES.SECURITY }
  ]

  return (
    <div className={`${navbarStyle} w-full bg-white transition-all duration-300`}>
      <div className="container-responsive">
        <div className="flex justify-between items-center h-[64px]">
          <Link to={ROUTES.HOME}>
            <img src={Logo2} alt="logo2" className="h-10" />
          </Link>

          <div className='hidden lg:block'>
            <ul className="relative flex font-medium">
              <MenuItem to={ROUTES.HOME}>Trang chủ</MenuItem>

              <li
                className="relative px-5 py-2.5 group"
                onMouseEnter={() => setHoveredMenu('jobList')}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link to={ROUTES.JOB_LIST} className="flex items-center transition-colors duration-300 group-hover:text-blue">
                  Việc làm <ChevronDownIcon className="w-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                {hoveredMenu === 'jobList' && <DropdownMenu items={jobMenuItems} className="w-md -left-1/2" />}
              </li>

              <li
                className="relative px-5 py-2.5 group"
                onMouseEnter={() => setHoveredMenu('createCV')}
                onMouseLeave={() => setHoveredMenu(null)}
                hidden={user?.role == 'employer'}
              >
                <Link to={ROUTES.CREATE_CV} className="flex items-center transition-colors duration-300 group-hover:text-blue">
                  Tạo CV <ChevronDownIcon className="w-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                {hoveredMenu === 'createCV' && <DropdownMenu items={cvMenuItems} className="w-2xs -left-1/2" />}
              </li>

              <MenuItem to={ROUTES.ABOUT}>Giới thiệu</MenuItem>
            </ul>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <ButtonArrowOne selectedPage={ROUTES.CREATE_JOB}>
                    Đăng một công việc
                  </ButtonArrowOne>
                </div>
                <Link to={ROUTES.NOTIFY}>
                  <div className="flex justify-center items-center w-[46px] h-[46px] rounded-full bg-white-low relative cursor-pointer">
                    <BellIcon className="w-6 h-6" />
                    {notiCount > 0 && (
                      <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                        {notiCount}
                      </span>
                    )}
                  </div>
                </Link>
                <div
                  className="relative flex items-center gap-2 p-2 h-[46px] rounded-full bg-white-low cursor-pointer"
                  onMouseEnter={() => setHoveredMenu('account')}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}/account/avatar?timestamp=${user?.avatarTimestamp || ''}`}
                    onError={(e) => { e.currentTarget.src = '/default-avatar.png' }}
                    alt="Avatar"
                    className="flex-shrink-0 w-8 h-8 rounded-full"
                  />
                  <ChevronDownIcon className="w-4 h-4" />
                  {hoveredMenu === 'account' && (
                    <div className="w-[300px] absolute top-full right-0 z-40">
                      <ul className="grid grid-cols-1 p-5 mt-6 transition-all duration-500 shadow-md animate-slideUp bg-white-bright rounded-small">
                        <li className="flex items-center gap-5 px-4 pt-2 pb-4 mb-2 border-b border-gray-light">
                          <img
                            src={`${import.meta.env.VITE_API_URL}/account/avatar?timestamp=${user?.avatarTimestamp || ''}`}
                            alt="avatar"
                            className="flex-shrink-0 w-10 h-10 rounded-full"
                          />
                          <div className="flex flex-col justify-between w-full overflow-hidden">
                            <p className="font-semibold truncate">{user?.name || 'Vô danh'}</p>
                            <p className="text-sm truncate">{user?.email}</p>
                          </div>
                        </li>
                        {accountMenuItems.map(({ label, to, hidden }, idx) => (
                          <MenuItem key={idx} to={to} hidden={hidden}>{label}</MenuItem>
                        ))}
                        <li className="px-4 py-2">
                          <button
                            onClick={handleLogout}
                            className="bg-blue text-white-bright w-full py-2.5 rounded-full text-center hover:bg-blue-mid cursor-pointer"
                          >
                            Đăng xuất
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="bg-blue text-white-bright px-4 py-2.5 rounded-full text-center hover:bg-blue-mid cursor-pointer"
                >
                  Đăng nhập
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="bg-gray-light text-black px-4 py-2.5 rounded-full text-center hover:bg-gray cursor-pointer"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
