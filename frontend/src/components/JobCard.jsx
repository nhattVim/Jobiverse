import { MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import React from 'react'
import ButtonArrowOne from '../shared/ButtonArrowOne'

const JobCard = ({
  jobTitle,
  imgCompany,
  jobType,
  salary,
  location,
  currentIndex
}) => {
  return (
    <div
      className={'inline-block w-[33%] h-full whitespace-normal align-top transition-transform duration-500 ease-in-out'}
      style={{ transform: `translateX(-${currentIndex * 100}%)` }}
    >
      <div className="mr-[50px]">
        <div className="flex flex-col items-start gap-[30px] p-10 bg-white rounded-medium w-full">
          <div className="flex flex-col items-start gap-5 w-full">
            <div className="flex justify-between items-start w-full">
              <div className="w-[70px] h-[70px] bg-white border border-white-low rounded-small flex justify-center items-center">
                <img src={imgCompany} alt="imgcompany" className="w-10 h-10" />
              </div>
              <div className="px-2 py-1 bg-yellow rounded-[5px]">{jobType}</div>
            </div>
            <h6 className="text-[22px] font-semibold leading-[28.6px]">
              {jobTitle}
            </h6>
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <CurrencyDollarIcon className="w-6 h-6 text-blue mr-[6px]" />
                <p className="text-black-low">{salary}</p>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="w-6 h-6 text-blue mr-[6px]" />
                <p className="text-black-low">{location}</p>
              </div>
            </div>
          </div>
          <ButtonArrowOne>Ứng tuyển</ButtonArrowOne>
        </div>
      </div>
    </div>
  )
}

export default JobCard
