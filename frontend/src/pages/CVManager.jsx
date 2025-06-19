import React, { useEffect, useState, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import apiFetch from '../services/api'
import BannerText from '../components/BannerText'
import { ToastContainer, toast } from 'react-toastify'
import PdfModal from '../components/PdfModal'
import CVPreviewModal from '../components/CVPreviewModal'
import {
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { ArrowUpTrayIcon, PlusIcon } from '@heroicons/react/24/solid'

const CVCardList = ({
  title,
  icon,
  cvList,
  loading,
  onCreate,
  onDelete,
  onSetDefault,
  cvDefault,
  type,
  onPreview
}) => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between p-6 shadow bg-white-low rounded-medium">
      <div className='w-full space-y-1.5'>
        <div className="flex items-center justify-between">
          <div className='flex items-center space-x-4'>
            <img src={icon} alt="cv icon" className="w-16 h-16" />
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          {onCreate && (
            <button
              onClick={onCreate}
              className="px-4 py-2 text-sm rounded-full cursor-pointer bg-blue hover:bg-blue-700 text-white-bright"
            >
              {type === 'CVUpload' ? (<div className='flex items-center gap-1'><ArrowUpTrayIcon className='w-4 h-4' />Tải CV lên</div>) : (<div className='flex items-center gap-1'><PlusIcon className='w-4 h-4' />Tạo mới</div>)}
            </button>
          )}
        </div>

        {loading ? (
          <p>Đang tải...</p>
        ) : cvList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-5">
            <img src="https://cdn-icons-png.freepik.com/256/10488/10488619.png" alt="job" className="w-20" />
            <p className="text-center text-gray-500">Bạn chưa có CV nào</p>
          </div>
        ) : (
          cvList.map(cv => (
            <div
              key={cv._id}
              className="flex items-center justify-between p-6 my-5 transition border group bg-white-mid border-gray-light rounded-medium hover:shadow-md hover:bg-gray-50"
            >
              <div>
                <button
                  onClick={() => onPreview(cv._id)}
                  className='block mb-1 text-lg font-semibold text-left cursor-pointer text-blue-mid hover:underline'
                >
                  {cv.title || 'Chưa đặt tên'}
                </button>

                {cv.desiredPosition && (
                  <p className="text-sm italic text-gray-500">{cv.desiredPosition}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">

                {cvDefault?.cv?._id === cv._id ? (
                  <span className="w-40 text-center px-4 py-1.5 text-sm text-white bg-green-600 rounded-full mr-20">
                    Mặc định
                  </span>
                ) : (
                  <button
                    onClick={() => onSetDefault(cv._id)}
                    className="w-40 px-4 py-1.5 text-sm text-white bg-blue rounded-full hover:bg-blue-700 transition cursor-pointer opacity-0 group-hover:opacity-100 text-center mr-20"
                  >
                    Đặt làm mặc định
                  </button>
                )}

                {type === 'CV' && (
                  <button
                    onClick={() => navigate(`/cv/${cv._id}`)}
                    className="px-4 py-1.5 text-sm text-white bg-green-600 rounded-full hover:bg-green-700"
                  >
                    <PencilSquareIcon className='w-5 h-5' />
                  </button>
                )}

                {type === 'CVUpload' && (
                  <a
                    href={`${import.meta.env.VITE_API_URL}/cv/uploads/${cv._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center px-4 py-1.5 text-white bg-blue rounded-full hover:bg-blue-700"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                  </a>
                )}

                <button
                  onClick={() => onDelete(cv._id)}
                  className="px-4 py-1.5 text-sm text-white bg-red rounded-full hover:bg-red-700 cursor-pointer"
                >
                  <TrashIcon className='w-5 h-5' />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const CVManagement = () => {
  const [cvList, setCvList] = useState([])
  const [cvUploads, setCvUploads] = useState([])
  const [cvUploadLoading, setCvUploadLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [previewId, setPreviewId] = useState(null)
  const [cvType, setCvType] = useState('')
  const [cvDefault, setCvDefault] = useState(null)
  const navigate = useNavigate()

  const loadData = useCallback(async () => {
    try {
      const [created, uploads] = await Promise.all([
        apiFetch('/cv/my', 'GET'),
        apiFetch('/cv/my/uploads', 'GET')
      ])
      setCvList(created)
      setCvUploads(uploads)
    } catch (error) {
      toast.error('Lỗi khi tải CV: ' + error.message)
    } finally {
      setLoading(false)
      setCvUploadLoading(false)
    }
  }, [])

  const loadDefaultCv = useCallback(async () => {
    try {
      const response = await apiFetch('/cv/default', 'GET')
      setCvDefault(response)
    } catch (error) {
      console.error('Lỗi khi tải CV mặc định:', error)
    }
  }, [])

  useEffect(() => {
    loadData()
    loadDefaultCv()
  }, [loadData, loadDefaultCv])

  const handleDelete = useCallback(async (id, isUpload) => {
    const endpoint = isUpload ? `/cv/uploads/${id}` : `/cv/${id}`
    const setter = isUpload ? setCvUploads : setCvList
    const list = isUpload ? cvUploads : cvList

    if (!window.confirm('Bạn có chắc chắn muốn xoá CV này?')) return
    try {
      await apiFetch(endpoint, 'DELETE')
      setter(list.filter(cv => cv._id !== id))
      toast.success('Xoá thành công')
    } catch (err) {
      toast.error('Xoá thất bại: ' + err.message)
    }
  }, [cvList, cvUploads])

  const handleSetDefault = async (id, type) => {
    try {
      await apiFetch(`/cv/${id}/set-default`, 'POST', { type })
      toast.success('Đặt CV mặc định thành công')
      loadDefaultCv()
    } catch (err) {
      toast.error('Lỗi khi đặt CV mặc định ' + err.message)
    }
  }

  const handleUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf, .doc, .docx'
    input.multiple = true
    input.onchange = async (e) => {
      const files = Array.from(e.target.files)
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      setCvUploadLoading(true)
      try {
        await apiFetch('/cv/uploads', 'POST', formData)
        toast.success('Tải lên thành công!')
        const updatedUploads = await apiFetch('/cv/my/uploads', 'GET')
        setCvUploads(updatedUploads)
        loadDefaultCv()
      } catch (err) {
        toast.error('Tải lên thất bại: ' + err.message)
      } finally {
        setCvUploadLoading(false)
      }
    }
    input.click()
  }

  return (
    <div className="min-h-screen">
      {previewId && (
        cvType === 'CVUpload' ? (
          <PdfModal cvId={previewId} onClose={() => setPreviewId(null)} />
        ) : (
          <CVPreviewModal cvId={previewId} onClose={() => setPreviewId(null)} />
        )
      )}

      <ToastContainer position="top-right" autoClose={3000} />
      <BannerText title="CV của tôi" caption="Tải CV của bạn bên dưới để có thể sử dụng xuyên suốt quá trình tìm việc." />
      <div className="flex items-start gap-16 px-6 py-20 mx-auto max-w-7xl">
        <div className="flex-shrink-0 w-1/4">
          <Sidebar />
        </div>

        <div className="w-3/4 space-y-10">
          <CVCardList
            title="CV đã tạo trên Jobiverse"
            icon="https://cdn-icons-png.freepik.com/256/11959/11959483.png"
            cvList={cvList}
            loading={loading}
            onCreate={() => navigate('/cv')}
            onDelete={(id) => handleDelete(id, false)}
            onSetDefault={(id) => handleSetDefault(id, 'CV')}
            cvDefault={cvDefault}
            type="CV"
            onPreview={(id) => {
              setPreviewId(id)
              setCvType('CV')
            }}
          />

          <CVCardList
            title="CV đã tải lên Jobiverse"
            icon="https://cdn-icons-png.freepik.com/256/11959/11959483.png"
            cvList={cvUploads}
            loading={cvUploadLoading}
            onCreate={handleUpload}
            onDelete={(id) => handleDelete(id, true)}
            onSetDefault={(id) => handleSetDefault(id, 'CVUpload')}
            cvDefault={cvDefault}
            type="CVUpload"
            onPreview={(id) => {
              setPreviewId(id)
              setCvType('CVUpload')
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default CVManagement
