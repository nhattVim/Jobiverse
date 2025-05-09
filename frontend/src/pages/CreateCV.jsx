import React, { useState } from 'react'
import CVForm from '../components/CVForm'
import CVPreview from '../components/CVPreview'
import BannerText from '../components/BannerText'

export default function CreateCV() {
  const [cvData, setCvData] = useState({
    avatar: '',
    name: '',
    birthday: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    sumary: '',
    website: '',
    summary: '',
    desiredPosition: '',
    experiences: [],
    educations: [],
    activities: [],
    achievement: [],
    skills: [],
    languages: [],
    socials: []
  })

  return (
    <> 
    <BannerText title="Tạo CV" caption="Cùng Jobiverse biến chiếc CV đơn điệu trở thành sân khấu biểu diễn độc nhất của riêng bạn với những mẫu CV từ đơn giản, chuyên nghiệp tới sáng tạo nhất được thiết kế riêng cho từng ngành nghề." />

    <div className="w-full py-20">
      <div className="container-responsive">
        <div className="min-h-screen bg-white font-sans text-[#1c1c1c] flex flex-col md:flex-row">
          <div className="flex items-start justify-center w-full h-screen pr-5 overflow-y-auto md:w-1/2">
            <CVForm cvData={cvData} setCvData={setCvData} />
          </div>
          {/* <div className="md:w-1/2 w-full bg-white shadow-xl p-4 flex justify-center items-start min-h-[92vh]"> */}
          <div className="md:w-1/2 w-full pl-5 flex justify-center items-start min-h-[92vh]">
            {/* <div className="p-2 bg-white shadow-xl"> */}
            <CVPreview cvData={cvData} />
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
