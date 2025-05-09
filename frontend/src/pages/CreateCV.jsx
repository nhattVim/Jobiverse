import React, { useState } from 'react'
import CVForm from '../components/CVForm'
import CVPreview from '../components/CVPreview'
import apiFetch from '../services/api'

export default function CreateCV() {
  const [cvData, setCvData] = useState({
    avatar: '',
    name: '',
    birthday: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    summary: '',
    desiredPosition: '',
    experiences: [],
    educations: [],
    activities: [],
    achievements: [],
    languages: [],
    socials: [],
    skills: []
  })

  const handleSubmit = async () => {
    try {
      await apiFetch('/cv', 'PUT', cvData)
      alert('Tạo CV thành công!')
    } catch (error) {
      alert('Tạo CV thất bại, vui lòng thử lại. ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#1c1c1c] flex flex-col md:flex-row py-2 pr-2 h-auto">
      <div className="flex items-start justify-center w-full h-auto p-6 md:w-1/2">
        <CVForm cvData={cvData} setCvData={setCvData} onSubmit={handleSubmit} />
      </div>
      <div className="md:w-1/2 w-full p-4 flex justify-center items-start min-h-[92vh] overflow-y-auto h-auto">
        <CVPreview cvData={cvData} />
      </div>
    </div>
  )
}
