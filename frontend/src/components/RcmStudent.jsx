import React, { useState, useEffect, useCallback } from 'react'
import apiFetch from '../services/api'
import PdfModal from '../components/PdfModal'
import CVPreviewModal from '../components/CVPreviewModal'
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon
} from '@heroicons/react/24/solid'

const RcmStudent = ({ id, title, isOwner, projectId, toast, reload }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [students, setStudents] = useState([])
  const [previewId, setPreviewId] = useState(null)
  const [cvType, setCvType] = useState('')

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    setCurrentIndex(isFirstSlide ? 0 : currentIndex - 1)
  }

  const goToNext = () => {
    const isLastSlide =
      students.length > 3
        ? currentIndex === students.length - 3
        : currentIndex === 0
    setCurrentIndex(isLastSlide ? 0 : currentIndex + 1)
  }

  const loadData = useCallback(async () => {
    try {
      const studentData = await apiFetch(`/projects/rcm/student/${id}`, 'GET')
      setStudents(studentData)
    } catch (error) {
      console.error('Error fetching projects:', error.message)
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    loadData()
  }, [id, loadData])

  const handleInvite = async (studentId) => {
    try {
      await apiFetch(`/projects/${projectId}/invite/${studentId}`, 'POST')
      reload()
      toast.success('Gửi lời mời thành công')
    } catch (error) {
      toast.error('Gửi lời mời thất bại: ' + error.message)
    }
  }

  return (
    <div className="flex flex-col items-start">
      {previewId && (
        cvType === 'CVUpload' ? (
          <PdfModal cvId={previewId} onClose={() => setPreviewId(null)} />
        ) : (
          <CVPreviewModal cvId={previewId} onClose={() => setPreviewId(null)} />
        )
      )}

      <div className="flex items-start justify-between w-full mb-10">
        {title}
        {students.length > 0 && (
          <div className="flex items-center gap-5">
            <ArrowLongLeftIcon
              className="w-10 h-10 text-black cursor-pointer"
              onClick={goToPrevious}
            />
            <ArrowLongRightIcon
              className="w-10 h-10 text-black cursor-pointer"
              onClick={goToNext}
            />
          </div>
        )}
      </div>

      <div className="w-full">
        {students.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            Hiện tại không ứng viên phù hợp
          </div>
        ) : (
          <div className="flex h-full gap-5 overflow-hidden whitespace-nowrap mr-[50px]">
            {students.map((s, i) => (
              <div
                key={s._id || i}
                className="flex flex-col items-start gap-[30px] p-10 bg-white rounded-medium w-[33%] h-full"
              >
                <div className="w-[70px] h-[70px] bg-white border border-white-low rounded-small flex justify-center items-center">
                  <img
                    src={`data:image/png;base64,${s.account?.avatar?.data}`}
                    alt="imgcompany"
                    className="object-cover w-10 h-10 rounded-full"
                  />
                </div>

                <h1 className="text-[22px] font-semibold leading-[28.6px] line-clamp-1 hover:text-blue transition-colors duration-300" >
                  {s.name}
                </h1>

                <button
                  className='p-4 text-white transition-colors duration-300 bg-black rounded-full cursor-pointer hover:bg-gray-800'
                  onClick={() => {
                    setPreviewId(s.defaultCV.cv)
                    setCvType(s.defaultCV.type)
                  }}
                >
                  Xem CV
                </button>

                {isOwner && (
                  <button
                    className='p-4 text-white transition-colors duration-300 rounded-full cursor-pointer bg-blue hover:bg-blue-dark'
                    onClick={() => handleInvite(s._id)}
                  >
                    Mời
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RcmStudent
