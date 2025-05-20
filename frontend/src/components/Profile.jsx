import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../routes/routePaths'

const Profile = ({ children, title, caption }) => {
  return (
    <>
      <div className='relative flex justify-center items-center bg-gradient-blue-left w-full h-[340px]'>
        <div className="absolute top-0 left-0 flex justify-between items-center w-full p-10">
          <div className="flex items-center gap-2 text-white cursor-pointer hover:text-yellow transition-colors duration-300">
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
          {children}
        </div>
      </div>
    </>
  )
}

export default Profile