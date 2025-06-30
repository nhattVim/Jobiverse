import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CVForm from '../components/CVForm'
import CVPreview from '../components/CVPreview'
import apiFetch from '../services/api'
import BannerText from '../components/BannerText'

export default function CVEditor() {
  const cvPreviewId = 'cv-preview'
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!!id)
  const [cvData, setCvData] = useState({
    title: '',
    avatar: '',
    name: '',
    birthday: null,
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
    const fetchData = async () => {
      if (id) {
        try {
          const data = await apiFetch(`/cv/${id}`, 'GET')
          setCvData(data)
        } catch (err) {
          alert('Không tải được CV: ' + err.message)
          navigate('/cv')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [id, navigate])

  const handleSubmit = async () => {
    try {
      if (id) {
        await apiFetch(`/cv/${id}`, 'PUT', cvData)
        alert('Cập nhật CV thành công!')
        navigate('/cv-manager')
      } else {
        await apiFetch('/cv', 'POST', cvData)
        alert('Tạo CV thành công!')
        navigate('/cv-manager')
      }
    } catch (error) {
      alert(`${id ? 'Cập nhật' : 'Tạo'} CV thất bại: ` + error.message)
    }
  }

  const generatePDF = async () => {
    const rawHtml = document.getElementById(cvPreviewId).outerHTML
    const styleTags = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n')
        } catch {
          return ''
        }
      })
      .join('\n')

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>${styleTags}</style>
        </head>
        <body>
          ${rawHtml}
        </body>
      </html>
    `

    try {
      const response = await apiFetch('/cv/generate-pdf', 'POST', { html: fullHtml })
      if (response instanceof Blob) {
        const blobUrl = URL.createObjectURL(response)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = cvData.title || 'cv.pdf'
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(blobUrl)
      } else {
        throw new Error('Dữ liệu trả về không phải Blob')
      }
    } catch (error) {
      alert('Lỗi khi tải CV: ' + error.message)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center w-full h-screen pb-[104px]">
      <p>Đang tải CV...</p>
    </div>
  )

  console.log('CV Data:', cvData)

  return (
    <>
      <BannerText
        title="Tạo CV"
        caption="Cùng Jobiverse biến chiếc CV đơn điệu trở thành sân khấu biểu diễn độc nhất của riêng bạn với những mẫu CV từ đơn giản, chuyên nghiệp tới sáng tạo nhất được thiết kế riêng cho từng ngành nghề."
      />

      <div className="w-full py-20">
        <div className="container-responsive">

          {/* Headerbar */}
          <div className="flex items-center justify-between p-4 px-6 mx-6 mb-8 bg-white border shadow-sm rounded-4xl border-gray">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={cvData.title}
                placeholder={cvData.title || 'CV chưa đặt tên'}
                onChange={e => setCvData({ ...cvData, title: e.target.value })}
                className="text-lg font-semibold bg-transparent border-none outline-none"
              />
            </div>
            <div className='space-x-4'>
              <button
                onClick={generatePDF}
                className="px-4 py-2 font-medium text-white rounded-full cursor-pointer bg-blue hover:bg-yellow hover:text-black"
              >
                Tải xuống
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 font-medium text-white rounded-full cursor-pointer bg-blue hover:bg-yellow hover:text-black"
              >
                Lưu CV
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="min-h-screen bg-white font-sans text-[#1c1c1c] flex flex-col md:flex-row h-auto gap-10">
            <div className="sticky top-[130px] flex items-start justify-center w-full h-auto md:w-1/2 max-h-screen overflow-y-hidden">
              <CVForm
                cvData={cvData}
                setCvData={setCvData}
                onSubmit={handleSubmit}
              />
            </div>
            <div className="md:w-1/2 w-full flex justify-center items-start min-h-[92vh] overflow-y-auto h-auto">
              <CVPreview cvData={cvData} id={cvPreviewId} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
