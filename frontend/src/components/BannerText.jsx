import React from 'react'

const BannerText = ({ title, caption }) => {
  return (
    <div className="container-responsive">
      <div className="relative h-[240px] w-full">
        <div className="absolute inset-0 h-full w-full">
          <div className="flex flex-col justify-center items-center h-full bg-gradient-blue-right gap-5 px-25 rounded-medium">
            <h2 className="text-5xl font-semibold leading-[62.4px] text-white">
              {title}
            </h2>
            <p className="text-white max-w-[70%] text-center">{caption}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BannerText
