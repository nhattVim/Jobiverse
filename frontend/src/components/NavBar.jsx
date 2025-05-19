import React, { useEffect, useState } from 'react'
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

const NavBar = () => {
  const navigate = useNavigate()
  const [isTopOfPage, setIsTopOfPage] = useState(true)
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true)
      }
      if (window.scrollY > 100) setIsTopOfPage(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      setIsLoggedIn(true)
      setUserInfo(user)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await apiFetch('/logout', 'POST')
      localStorage.removeItem('user')
      setIsLoggedIn(false)
      setUserInfo(null)
      navigate(ROUTES.HOME)
    } catch (error) {
      console.log('Đăng xuất thất bại', error)
    }
  }

  const navbarStyle = isTopOfPage
    ? 'py-5'
    : 'fixed top-0 left-0 z-[999] py-2 drop-shadow animate-slideDown'

  return (
    <div
      className={`${navbarStyle} w-full bg-white transition-all duration-300`}
    >
      <div className="container-responsive">
        <div className="flex justify-between items-center h-[64px]">
          <div>
            <img src={Logo2} alt="logo2" className="h-10" />
          </div>

          <div className='hidden lg:block'>
            <ul className="relative flex font-medium">
              <li className="px-5 py-2.5">
                <Link
                  to={ROUTES.HOME}
                  className="transition-colors duration-300 hover:text-blue"
                >
                  Trang chủ
                </Link>
              </li>
              <li
                className="px-5 py-2.5 relative group"
                onMouseEnter={() => setHoveredMenu('jobList')}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link
                  to={ROUTES.JOB_LIST}
                  className="flex items-center transition-colors duration-300 group-hover:text-blue"
                >
                  Việc làm
                  <ChevronDownIcon className="w-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                {hoveredMenu === 'jobList' && (
                  <div className="absolute z-50 w-md top-full -left-1/2">
                    <ul className="grid grid-cols-2 p-5 mt-6 transition-all duration-500 shadow-md bg-white-bright rounded-small">
                      <li className="px-4 py-2 transition-colors duration-300 hover:text-blue">
                        <Link to={ROUTES.JOB_LIST}>Danh sách việc làm</Link>
                      </li>
                      <li className="px-4 py-2 transition-colors duration-300 hover:text-blue">
                        <Link to={ROUTES.SAVED_JOB}>Việc làm đã lưu</Link>
                      </li>
                      <li className="px-4 py-2 transition-colors duration-300 hover:text-blue">
                        <Link to={ROUTES.JOB_LIST}>Việc làm đã ứng tuyển</Link>
                      </li>
                      <li className="px-4 py-2 transition-colors duration-300 hover:text-blue">
                        <Link to={ROUTES.JOB_POST}>Đăng việc làm</Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
              <li
                className="px-5 py-2.5 relative group"
                onMouseEnter={() => setHoveredMenu('createCV')}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link
                  to={ROUTES.CREATE_CV}
                  className="flex items-center transition-colors duration-300 cursor-pointer group-hover:text-blue"
                >
                  Tạo CV
                  <ChevronDownIcon className="w-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                {hoveredMenu === 'createCV' && (
                  <div className="absolute z-50 w-2xs top-full -left-1/2">
                    <ul className="grid grid-cols-2 p-5 mt-6 transition-all duration-500 shadow-md bg-white-bright rounded-small">
                      <li className="px-4 py-2 transition-colors duration-300 hover:text-blue">
                        <Link to={ROUTES.CV_MANAGER}>Quản lý CV</Link>
                      </li>
                      <li className="px-4 py-2 transition-colors duration-300 hover:text-blue">
                        <Link to={ROUTES.CREATE_CV}>Tạo CV mới</Link>
                      </li>
                      <li className="px-4 py-2 transition-colors duration-300 hover:text-blue">
                        <Link to={ROUTES.UPLOAD_CV}>Upload CV</Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
              <li className="px-5 py-2.5">
                <Link
                  to={ROUTES.HOME}
                  className="transition-colors duration-300 hover:text-blue"
                >
                  Giới thiệu
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              // Hiển thị thông tin tài khoản khi đã đăng nhập
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <ButtonArrowOne selectedPage={ROUTES.JOB_POST}>
                    Đăng một công việc
                  </ButtonArrowOne>
                </div>
                <div className="flex justify-center items-center w-[46px] h-[46px] rounded-full bg-white-low">
                  <BellIcon className="w-6 h-6" />
                </div>
                <div
                  className="relative flex items-center gap-2 p-2 h-[46px] rounded-full bg-white-low cursor-pointer"
                  onMouseEnter={() => setHoveredMenu('account')}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <UserCircleIcon className="w-6 h-6" />
                  <ChevronDownIcon className="w-4 h-4" />
                  {hoveredMenu === 'account' && (
                    <div className="w-[300px] absolute top-full right-0 z-50">
                      <ul className="grid grid-cols-1 p-5 mt-6 transition-all duration-500 shadow-md bg-white-bright rounded-small">
                        <li className="flex items-center gap-5 px-4 pt-2 pb-4 mb-2 border-b border-gray-light">
                          <img
                            src={`http://localhost:3000/account/avatar?timestamp=${Date.now()}`}
                            alt="avatar"
                            className="flex-shrink-0 w-10 h-10 rounded-full"
                          />
                          <div className="flex flex-col justify-between w-full overflow-hidden">
                            <p className="font-semibold truncate">{userInfo?.accountType}</p>
                            <p className="text-sm truncate">{userInfo?.email}</p>
                          </div>
                        </li>
                        <li className="px-4 py-2 transition-colors duration-300 hover:text-blue">
                          <Link to={ROUTES.SET_INFORMATION}>
                            Thông tin cá nhân
                          </Link>
                        </li>
                        <li className="px-4 py-2 transition-colors duration-300 hover:text-blue">
                          <Link to={ROUTES.CV_MANAGER}>
                            CV của tôi
                          </Link>
                        </li>
                        <li className="px-4 py-2 transition-colors duration-300 hover:text-blue">
                          <Link to={ROUTES.SAVED_JOB}>
                            Việc làm đã lưu
                          </Link>
                        </li>
                        <li className="px-4 py-2 transition-colors duration-300 hover:text-blue">
                          <Link to={ROUTES.SAVED_JOB}>
                            Việc làm đã ứng tuyển
                          </Link>
                        </li>
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
              // Hiển thị nút "Đăng nhập" và "Đăng ký" khi chưa đăng nhập
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
