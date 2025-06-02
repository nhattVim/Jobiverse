import {
  MapPinIcon,
  CurrencyDollarIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import React, { useContext, useState } from 'react'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import apiFetch from '../services/api'
import { ROUTES } from '../routes/routePaths'
import UserContext from '../contexts/UserContext'
import { Link } from 'react-router-dom'

const JobCard = ({ job, currentIndex, isFavoritedInitially }) => {
  const { user } = useContext(UserContext)
  const [isFavorited, setIsFavorited] = useState(isFavoritedInitially)

  const handleFavorite = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để sử dụng chức năng này!')
      return
    }
    const newFavoriteState = !isFavorited
    setIsFavorited(newFavoriteState)

    try {
      if (newFavoriteState) {
        await apiFetch('/favorites', 'POST', { projectId: job._id })
      } else {
        await apiFetch(`/favorites/${job._id}`, 'DELETE')
      }
    } catch (err) {
      console.error('Failed to save favorite state', err)
      setIsFavorited(!newFavoriteState)
    }
  }

  return (
    <div
      className={
        'inline-block w-[33%] h-full whitespace-normal align-top transition-transform duration-500 ease-in-out'
      }
      style={{ transform: `translateX(-${currentIndex * 100}%)` }}
    >
      <div className="mr-[50px]">
        <div className="group flex flex-col items-start gap-[30px] p-10 bg-white rounded-medium w-full cursor-pointer">
          <div className="flex flex-col items-start w-full gap-5">
            <div className="flex items-start justify-between w-full">
              <div className="w-[70px] h-[70px] bg-white border border-white-low rounded-small flex justify-center items-center">
                <img
                  src={`data:image/png;base64,${job.account?.avatar?.data}`}
                  alt="imgcompany"
                  className="object-cover w-10 h-10 rounded-full"
                />
              </div>
              <div className="px-2 py-1 bg-yellow rounded-[5px]">
                {job.workType}
              </div>
            </div>
            <Link
              to={`/job-detail/${job._id}?isFavorited=${isFavorited}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[22px] font-semibold leading-[28.6px] line-clamp-1 hover:text-blue transition-colors duration-300"
            >
              {job.title}
            </Link>
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <CurrencyDollarIcon className="w-6 h-6 text-blue mr-[6px]" />
                <p className="text-black-low">{job.salary}</p>
              </div>
              <div className="flex items-center">
                <div>
                  <MapPinIcon className="w-6 h-6 text-blue mr-[6px]" />
                </div>
                <p className="text-black-low line-clamp-1">
                  {[job.location?.ward, job.location?.district, job.location?.province]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <ButtonArrowOne
              selectedPage={`/job-detail/${job._id}?openApply=true&isFavorited=${isFavorited}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              Ứng tuyển
            </ButtonArrowOne>
            <div
              onClick={handleFavorite}
              className="h-[46px] w-[46px] flex justify-center items-center rounded-full border-2 border-blue invisible group-hover:visible"
            >
              {isFavorited ? (
                <HeartSolidIcon className="w-6 h-6 text-blue animate-pop" />
              ) : (
                <HeartIcon className="w-6 h-6 text-blue" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobCard
