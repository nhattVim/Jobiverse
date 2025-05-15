import { BuildingOffice2Icon, MapPinIcon } from '@heroicons/react/24/outline'
import React from 'react'

const EmployerInfo = () => {
  return (
    <>
      <div className="w-full bg-gradient-blue-right py-10">
        <div className="flex justify-center items-center">
          <div className="w-40 h-40 bg-white border border-white-low rounded-small flex justify-center items-center">
            <img
              src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBK0xPTEE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--e622a8382b21b032819f520d792bef976ace053e/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcEFhb3ciLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--bb0ebae071595ab1791dc0ad640ef70a76504047/TX_RGB_Primary_onWhite.png"
              alt="imgcompany"
              className="object-cover"
            />
          </div>

          <div className="text-white">
            <h6 className="text-3xl font-semibold">TymeX</h6>

            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <MapPinIcon className="w-6 h-6 mr-[6px] text-" />
                <p>TP Hồ Chí Minh</p>
              </div>
              <div className="flex items-center">
                <BuildingOffice2Icon className="w-6 h-6 mr-[6px]" />
                <p>Phần mềm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=""></div>
    </>
  )
}

export default EmployerInfo
