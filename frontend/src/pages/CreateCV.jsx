import React, { useState } from 'react'
import CVForm from '../components/CVForm'
import CVPreview from '../components/CVPreview'

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
    <div className="min-h-screen bg-white font-sans text-[#1c1c1c] flex flex-col md:flex-row py-2 pr-2">
      <div className="flex items-start justify-center w-full h-screen p-6 overflow-y-auto md:w-1/2">
        <CVForm cvData={cvData} setCvData={setCvData} />
      </div>
      {/* <div className="md:w-1/2 w-full bg-white shadow-xl p-4 flex justify-center items-start min-h-[92vh]"> */}
      <div className="md:w-1/2 w-full p-4 flex justify-center items-start min-h-[92vh]">
        {/* <div className="p-2 bg-white shadow-xl"> */}
        <CVPreview cvData={cvData} />
        {/* </div> */}
      </div>
    </div>
  )
}
