import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import React, { useContext, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes/routePaths'
import UserContext from '../contexts/UserContext'

const Profile = ({ children, title, caption }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user } = useContext(UserContext)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <div className='relative flex justify-center items-center bg-gradient-blue-left w-full h-[340px]'>
        <div className="absolute top-0 left-0 flex justify-between items-center w-full p-10">
          <div onClick={() => navigate(-1)} className="flex items-center gap-2 text-white cursor-pointer hover:text-yellow transition-colors duration-300">
            <ArrowLeftIcon className='w-5 h-5'/>
            <span>Quay lại</span>
          </div>
          <Link to={ROUTES.HOME} className="text-white text-2xl">Jobiverse.</Link>
        </div>
        <div className="flex flex-col items-center gap-4">
          <h4 className='text-white text-3xl'>{title}</h4>
          <p className='text-white w-[650px] text-center'>{caption}</p>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto w-full">
        <div className="absolute -top-20 w-full bg-white-low h-full rounded-medium">
          {user.profile === true ?
            <div className="flex flex-col justify-end items-center gap-5 w-full h-[340px]">
              <p className='text-xl font-semibold'>Bạn đã có profile ! Vui lòng kiểm tra thông tin cá nhân !</p>

              <Link to={ROUTES.SET_INFORMATION}
                className="px-6 py-2 text-white transition rounded-full bg-blue hover:bg-blue-700 cursor-pointer"
              >
                Xem chi tiết
              </Link>
            </div>
            : children
          }
        </div>
      </div>
    </>
  )
}

export default Profile