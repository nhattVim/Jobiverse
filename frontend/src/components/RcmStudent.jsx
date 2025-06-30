import React, { useState, useEffect, useCallback } from 'react'
import apiFetch from '../services/api'
import PdfModal from '../components/PdfModal'
import CVPreviewModal from '../components/CVPreviewModal'
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon
} from '@heroicons/react/24/solid'
import { BookOpenIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline'

const RcmStudent = ({ id, title, isOwner, projectId, toast, reload, invitedStudentIds }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [students, setStudents] = useState([])
  const [previewId, setPreviewId] = useState(null)
  const [cvType, setCvType] = useState('')
  const [localInvitedStudentIds, setLocalInvitedStudentIds] = useState(invitedStudentIds || [])

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
      setLocalInvitedStudentIds(prev => [...prev, studentId])
      reload()
      toast.success('Gửi lời mời thành công')
    } catch (error) {
      toast.error('Gửi lời mời thất bại: ' + error.message)
    }
  }

  const isInvited = (studentId) => localInvitedStudentIds.includes(studentId)

  useEffect(() => {
    setLocalInvitedStudentIds(invitedStudentIds || [])
  }, [invitedStudentIds])

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
          <div className="h-full overflow-hidden whitespace-nowrap"
          >
            {students.map((s, i) => (
              <div
                key={s._id || i}
                className={
                  'inline-block w-[32.5%] h-full whitespace-normal align-top transition-transform duration-500 ease-in-out'
                }
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                <div className="mr-[50px]">
                  <div
                    className="flex flex-col items-center justify-center w-full h-full border bg-white-bright rounded-medium border-gray-light"
                  >
                    <div className="flex flex-col items-center gap-4 p-10">
                      <img
                        src={`data:image/png;base64,${s.account?.avatar?.data || s.account?.avatar}`}
                        alt="imgcompany"
                        className="object-cover rounded-full w-25 h-25"
                      />
                      <div className="space-y-2 text-center">
                        <h1 className="text-xl font-semibold leading-[28.6px] line-clamp-1 hover:text-blue transition-colors duration-300" >
                          {s.name}
                        </h1>
                        <div className="flex items-center justify-center gap-2">
                          {Array.isArray(s.interests) && s.interests.length > 1 ? (
                            s.interests.map((e, i) => (
                              <p key={i} className='px-3 py-1 text-sm text-yellow-600 bg-yellow-100 rounded-small'>{e}</p>
                            ))
                          ) : (
                            <p className="px-3 py-1 text-sm text-yellow-600 bg-yellow-100 rounded-small">Chưa có kĩ năng</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full p-10 space-y-5 bg-gray-50 rounded-bl-medium rounded-br-medium">
                      <div className="flex items-center gap-5">
                        <div className="flex flex-col items-start min-w-0 gap-2">
                          <span className='text-sm text-gray-dark'>Trường</span>
                          <div className="flex items-center min-w-0 gap-2">
                            <BuildingLibraryIcon className='flex-shrink-0 w-5 h-5 text-black' />
                            <p className='text-sm truncate max-w-[120px]'>{s.university}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start min-w-0 gap-2">
                          <span className='text-sm text-gray-dark'>Ngành</span>
                          <div className="flex items-center min-w-0 gap-2">
                            <BookOpenIcon className='flex-shrink-0 w-5 h-5 text-black' />
                            <p className='text-sm truncate max-w-[120px]'>{s.major.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full gap-3">
                        <button
                          className='w-full py-3 text-sm transition-colors duration-300 ease-in-out bg-blue-100 rounded-full outline-none cursor-pointer text-blue hover:bg-blue hover:text-white'
                          onClick={() => {
                            if (s.defaultCV?.cv) {
                              setPreviewId(s.defaultCV.cv)
                              setCvType(s.defaultCV.type)
                            } else {
                              toast.warn('Sinh viên này chưa có CV.')
                            }
                          }}
                        >
                          Xem CV
                        </button>
                        {isOwner && (
                          <button
                            className={`${isInvited(s._id) ? 'text-blue bg-transparent border border-blue' : 'text-white bg-blue hover:bg-blue-mid'} w-full py-3 text-sm transition-colors duration-300 rounded-full outline-none cursor-pointer`}
                            onClick={() => {
                              if (s.defaultCV?.cv) {
                                handleInvite(s._id)
                              } else {
                                toast.warn('Sinh viên này chưa có CV.')
                              }
                            }}
                            disabled={isInvited(s._id)}
                          >
                            { isInvited(s._id) ? 'Đã mời' : 'Mời tham gia' }
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RcmStudent
