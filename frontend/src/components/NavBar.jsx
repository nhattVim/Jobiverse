import React, { useEffect, useState } from 'react'
import Logo2 from '../assets/Logo2.svg'
import { Link } from 'react-router-dom'
import {
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon
} from '@heroicons/react/24/solid'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import { ROUTES } from '../routes/routePaths'

const NavBar = () => {
  const [isTopOfPage, setIsTopOfPage] = useState(true)

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

  const navbarStyle = isTopOfPage ? 'py-5' : 'fixed top-0 left-0 z-50 py-2 drop-shadow animate-slideDown'

  return (
    <div className={`${navbarStyle} w-full bg-white transition-all duration-300`}>
      <div className="container-responsive">
        <div className="flex justify-between items-center h-[64px]">
          <div>
            <img src={Logo2} alt="logo2" className="h-10" />
          </div>

          <div>
            <ul className="flex font-medium">
              <li className="px-5 py-2.5">
                <Link to={ROUTES.HOME}>Trang chủ</Link>
              </li>
              <li className="px-5 py-2.5">
                <Link className="flex items-center" to={ROUTES.JOB_LIST}>
                  Việc làm
                  <ChevronDownIcon className="w-4 ml-1" />
                </Link>
              </li>
              <li className="px-5 py-2.5">
                <Link className="flex items-center" to={ROUTES.CV_LIST}>
                  Tạo CV
                  <ChevronDownIcon className="w-4 ml-1" />
                </Link>
              </li>
              <li className="px-5 py-2.5">
                <Link to={ROUTES.HOME}>Giới thiệu</Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <ButtonArrowOne selectedPage={ROUTES.JOB_POST}>Đăng một công việc</ButtonArrowOne>
            <div className="flex justify-center items-center w-[46px] h-[46px] rounded-full bg-white-low">
              <BellIcon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 p-2 h-[46px] rounded-full bg-white-low">
              <UserCircleIcon className="w-6 h-6" />
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
