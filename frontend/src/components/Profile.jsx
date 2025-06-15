import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import React, { useContext, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes/routePaths'
import { UserContext } from '../contexts/UserContext'

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
        <div className="absolute top-0 left-0 flex items-center justify-between w-full p-10">
          <div onClick={() => navigate(-1)} className="flex items-center gap-2 text-white transition-colors duration-300 cursor-pointer hover:text-yellow">
            <ArrowLeftIcon className='w-5 h-5' />
            <span>Quay lại</span>
          </div>
          <Link to={ROUTES.HOME} className="text-2xl text-white">Jobiverse.</Link>
        </div>
        <div className="flex flex-col items-center gap-4">
          <h4 className='text-3xl text-white'>{title}</h4>
          <p className='text-white w-[650px] text-center'>{caption}</p>
        </div>
      </div>

      <div className="relative w-full max-w-4xl mx-auto">
        <div className="absolute w-full h-full -top-20 bg-white-low rounded-medium">
          {user.profile === true ?
            <div className="flex flex-col justify-end items-center gap-5 w-full h-[340px]">
              <p className='text-xl font-semibold'>Bạn đã có profile ! Vui lòng kiểm tra thông tin cá nhân !</p>

              <Link to={ROUTES.SET_INFORMATION}
                className="px-6 py-2 text-white transition rounded-full cursor-pointer bg-blue hover:bg-blue-700"
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
