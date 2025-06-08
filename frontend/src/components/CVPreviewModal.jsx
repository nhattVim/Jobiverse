import { useEffect, useState } from 'react'
import CVPreview from './CVPreview'
import apiFetch from '../services/api'

export default function CVPreviewModal({ cvId, cvData: propData, onClose }) {
  const [cvData, setCvData] = useState(propData || null)
  const [loading, setLoading] = useState(!!cvId)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const fetchCv = async () => {
      if (!propData && cvId) {
        setLoading(true)
        try {
          const data = await apiFetch(`/cv/${cvId}`, 'GET')
          setCvData(data)
        } catch (error) {
          alert('Không thể tải CV: ' + error.message)
          console.error('Lỗi khi tải CV:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchCv()
  }, [cvId, propData])

  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-4xl w-full max-h-[98vh] overflow-y-auto rounded-lg shadow-lg relative"
        onClick={e => e.stopPropagation()}
      >

        <div className="sticky top-0 z-50 flex justify-end p-2 bg-white border-b">
          <button onClick={onClose} className="mr-4 text-black hover:text-red">✕</button>
        </div>

        {loading ? (
          <div className="p-6">Đang tải CV...</div>
        ) : (
          <CVPreview cvData={cvData} />
        )}
      </div>
    </div>
  )
}
