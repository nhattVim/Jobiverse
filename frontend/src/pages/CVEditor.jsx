import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CVForm from '../components/CVForm'
import CVPreview from '../components/CVPreview'
import apiFetch from '../services/api'

export default function CVEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!!id)
  const [cvData, setCvData] = useState({
    title: '',
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

  useEffect(() => {
    if (id) {
      apiFetch(`/cv/${id}`, 'GET')
        .then(res => {
          setCvData(res)
        })
        .catch(err => {
          alert('Không tải được CV: ' + err.message)
          navigate('/cv')
        })
        .finally(() => setLoading(false))
    }
  }, [id, navigate])

  const handleSubmit = async () => {
    try {
      console.log(cvData)
      if (id) {
        await apiFetch(`/cv/${id}`, 'PUT', cvData)
        alert('Cập nhật CV thành công!')
        navigate('/cv-list')
      } else {
        await apiFetch('/cv', 'POST', cvData)
        alert('Tạo CV thành công!')
        navigate('/cv-list')
      }
    } catch (error) {
      if (id) {
        alert('Cập nhật CV thất bại, vui lòng thử lại. ' + error.message)
      } else {
        alert('Tạo CV thất bại, vui lòng thử lại. ' + error.message)
      }
    }
  }

  if (loading) return <p className="p-4">Đang tải CV...</p>

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
