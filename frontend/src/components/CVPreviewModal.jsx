import { useEffect, useState } from 'react'
import CVPreview from './CVPreview'
import apiFetch from '../services/api'
import { XMarkIcon } from '@heroicons/react/24/solid'
import SpinnerLoading from '../shared/loading/SpinnerLoading'

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
    const handler = (e) => {
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
      <div className="relative">
        <div className="fixed z-50 flex justify-end w-full max-w-3xl px-3 py-2 bg-white rounded-tl-lg rounded-tr-lg drop-shadow">
          <div
            onClick={onClose}
            className="p-1 font-bold rounded-full cursor-pointer text-gray-dark bg-white-mid hover:bg-red-100 hover:text-red"
          >
            <XMarkIcon className="w-3 h-3" />
          </div>
        </div>
        <div
          className="bg-white w-3xl overflow-y-auto max-h-[88vh] shadow-lg relative scrollbar-custom mt-[36px] mb-4 p-5"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <SpinnerLoading color='border-blue' />
            </div>
          ) : (
            <CVPreview cvData={cvData} />
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-between w-full h-4 max-w-3xl bg-white rounded-bl-lg rounded-br-lg border-white-low">
        </div>
      </div>
    </div>
  )
}
