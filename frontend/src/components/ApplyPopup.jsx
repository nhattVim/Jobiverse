/* eslint-disable no-unused-vars */
import {
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  FolderPlusIcon,
  PaperAirplaneIcon,
  XMarkIcon
} from '@heroicons/react/24/solid'
import { useContext, useEffect, useState } from 'react'
import apiFetch from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes/routePaths'
import { TrashIcon } from '@heroicons/react/24/outline'
import 'react-toastify/dist/ReactToastify.css'
import { ApplicationStatusContext } from '../contexts/ApplicationStatusContext'
import SpinnerLoading from '../shared/loading/SpinnerLoading'
import PdfModal from '../components/PdfModal'
import CVPreviewModal from '../components/CVPreviewModal'

const ApplyPopup = ({ closePopup, applyTitle, projectId, toast }) => {
  const navigate = useNavigate()
  const [cvList, setCvList] = useState([])
  const [cvUploads, setCvUploads] = useState([])
  const [form, setForm] = useState({ cv: null })
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [active, setActive] = useState('a')
  const [selectedCV, setSelectedCV] = useState(null)
  const [uploadedCVId, setUploadedCVId] = useState(null)
  const [cvDefault, setCvDefault] = useState(null)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [loadingCVList, setLoadingCVList] = useState(true)
  const [coverLetter, setCoverLetter] = useState('')
  const [previewId, setPreviewId] = useState(null)
  const [cvType, setCvType] = useState('')
  const { updateStatus, fetchAppliedStatus } = useContext(ApplicationStatusContext)

  const handleToggle = (key) => {
    if (key !== active) {
      setActive(key)
    }
    if (key === 'b') {
      setSelectedCV(null)
    }
  }

  const handleSelectCV = (cv) => {
    setSelectedCV(cv)
    setForm({ ...form, cv: null })
    setError('')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      if (validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024) {
        setForm({ ...form, cv: file })
        setError('')
        uploadCV(file)
      } else {
        setError(
          'Vui lòng chọn file .pdf, .doc, .docx với kích thước dưới 5MB.'
        )
        setForm({ ...form, cv: null })
        setUploadedCVId(null)
      }
    }
  }

  const uploadCV = async (file) => {
    if (!file) return
    const formData = new FormData()
    formData.append('files', file)
    try {
      const res = await apiFetch('/cv/uploads', 'POST', formData)
      if (res && res.uploadedFile && res.uploadedFile._id) {
        setUploadedCVId(res.uploadedFile._id)
      } else {
        setUploadedCVId(null)
      }
    } catch (err) {
      setUploadedCVId(null)
      if (
        err.message.includes('Unauthorized') ||
        err.message.includes('Token')
      ) {
        setError('Bạn cần đăng nhập để tải CV lên.')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError('Tải CV thất bại, vui lòng thử lại.')
      }
    }
  }

  const selectDefaultCV = (cvDefault, cvOnline, cvUpload) => {
    if (cvDefault?.type === 'CV') {
      const match = cvOnline.find(cv => cv._id === cvDefault.cv._id)
      if (match) {
        setSelectedCV(match)
        setActive('a')
      }
    } else if (cvDefault?.type === 'CVUpload') {
      const match = cvUpload.find(cv => cv._id === cvDefault.cv._id)
      if (match) {
        setSelectedCV(match)
        setActive('a')
      }
    }
  }

  useEffect(() => {
    const loadCV = async () => {
      try {
        const [cvOnline, cvUpload, cvDefault] = await Promise.all([
          apiFetch('/cv/my', 'GET'),
          apiFetch('/cv/my/uploads', 'GET'),
          apiFetch('/cv/default', 'GET')
        ])
        setCvList(cvOnline)
        setCvUploads(cvUpload)
        setCvDefault(cvDefault)
        selectDefaultCV(cvDefault, cvOnline, cvUpload)
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu CV:', err)
      } finally {
        setLoadingCVList(false)
      }
    }

    loadCV()
  }, [])

  const handleSubmit = async () => {
    if (!selectedCV && !form.cv) {
      setError('Vui lòng chọn CV để nộp hồ sơ.')
      return
    }

    setLoadingSubmit(true)

    try {
      if (selectedCV) {
        await apiFetch(`/projects/${projectId}/apply`, 'POST', { cvId: selectedCV._id, coverLetter })
        updateStatus(projectId, { status: 'pending' })
      } else if (form.cv && uploadedCVId) {
        await apiFetch(`/projects/${projectId}/apply`, 'POST', { cvId: uploadedCVId, coverLetter })
        updateStatus(projectId, { status: 'pending' })
      } else {
        setError('Vui lòng chờ file CV tải lên xong!')
        return
      }

      fetchAppliedStatus()
      toast.success('Nộp hồ sơ ứng tuyển thành công')
      closePopup()
    } catch (err) {
      setError('Nộp hồ sơ thất bại. ' + err.message)
      toast.error('Nộp hồ sơ thất bại. ' + err.message)
    } finally {
      setLoadingSubmit(false)
    }
  }

  return (
    <div className="fixed z-[999] inset-0 flex justify-center items-center">
      {previewId && (
        cvType === 'CVUpload' ? (
          <PdfModal cvId={previewId} onClose={() => setPreviewId(null)} />
        ) : (
          <CVPreviewModal cvId={previewId} onClose={() => setPreviewId(null)} />
        )
      )}

      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 bg-white-bright min-h-[90%] mx-auto shadow-lg w-full max-w-2xl rounded-small animate-slideUp">
        <div className="fixed z-50 flex items-center justify-between w-full max-w-2xl px-8 py-5 shadow">
          <h6 className="text-xl font-semibold">
            Ứng tuyển <span className="text-blue">{applyTitle}</span>
          </h6>
          <div
            onClick={() => closePopup()}
            className="p-1 font-bold rounded-full cursor-pointer text-gray-dark bg-white-mid hover:bg-blue-100 hover:text-blue"
          >
            <XMarkIcon className="w-6 h-6" />
          </div>
        </div>
        <div className="flex flex-col gap-4 items-start mt-18 px-8 py-5 overflow-auto scrollbar-custom max-h-[calc(100vh-234px)]">
          <div className="flex items-center gap-2.5">
            <FolderPlusIcon className="w-6 h-6 text-blue" />
            <p className="font-semibold">Chọn CV để ứng tuyển</p>
          </div>

          <div
            className={`${active === 'a' ? 'border-blue' : 'border-gray-light'}
            border group hover:border-blue w-full p-4 rounded-small text-sm transition-all duration-300`}
          >
            <div
              onClick={() => handleToggle('a')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div
                className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${active === 'a'
                  ? 'after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-blue border-blue'
                  : 'border-gray'}`}
              ></div>
              <p
                className={`${active === 'a' ? 'text-blue' : ''} font-semibold group-hover:text-blue`}
              >
                Chọn CV trong thư viện CV của tôi
              </p>
            </div>
            <AnimatePresence initial={false}>
              {active === 'a' && (
                <motion.div
                  key={'a'}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {loadingCVList ? (
                    <div className="flex items-center justify-center py-6">
                      <SpinnerLoading width={6} height={6} color='border-gray-400' />
                    </div>
                  ) : (
                    <>
                      {cvList.length === 0 && cvUploads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 pt-5">
                          Bạn chưa có CV nào trong thư viện
                          <Link
                            to={ROUTES.CREATE_CV}
                            className="px-4 py-2 transition-colors rounded-full cursor-pointer text-white-bright bg-blue hover:bg-blue-mid"
                          >
                            Tạo CV mới
                          </Link>
                        </div>
                      ) : (
                        <>
                          {cvList.length === 0 ? (
                            ''
                          ) : (
                            <div className="space-y-2">
                              <p className="mt-4 font-semibold">CV Online</p>{' '}
                              {cvList.map((data) => (
                                <div
                                  key={data._id}
                                  className={`group/a flex justify-between items-center transition-all duration-300 px-4 py-3 border rounded-small cursor-pointer ${selectedCV && selectedCV._id === data._id
                                    ? 'border-blue bg-blue-50'
                                    : 'border-gray-light hover:border-blue'}`}
                                  onClick={() => handleSelectCV(data)}
                                >
                                  {data.title || 'Chưa đặt tên'}

                                  {cvDefault?.type === 'CV' && cvDefault?.cv._id === data._id && (
                                    <span className="px-2 py-0.5 text-xs font-semibold text-white bg-green-500 rounded-full">
                                      Mặc định
                                    </span>
                                  )}

                                  <button
                                    className={`${selectedCV && selectedCV._id === data._id
                                      ? 'visible'
                                      : ''} invisible text-blue group-hover/a:visible cursor-pointer`}
                                    onClick={() => {
                                      setPreviewId(data._id)
                                      setCvType('CV')
                                    }}
                                  >
                                    Xem
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {cvUploads.length === 0 ? (
                            ''
                          ) : (
                            <div className="space-y-2">
                              <p className="mt-4 font-semibold">CV đã tải lên</p>
                              {cvUploads.map((data) => (
                                <div
                                  key={data._id}
                                  className={`group/a flex justify-between items-center transition-all duration-300 px-4 py-3 border rounded-small cursor-pointer ${selectedCV && selectedCV._id === data._id
                                    ? 'border-blue bg-blue-50'
                                    : 'border-gray-light hover:border-blue'}`}
                                  onClick={() => handleSelectCV(data)}
                                >
                                  {data.title || 'Chưa đặt tên'}

                                  {cvDefault?.type === 'CVUpload' && cvDefault?.cv._id === data._id && (
                                    <span className="px-2 py-0.5 text-xs text-white bg-green-500 rounded-full">
                                      Mặc định
                                    </span>
                                  )}

                                  <button
                                    className={`${selectedCV && selectedCV._id === data._id
                                      ? 'visible'
                                      : ''} invisible text-blue group-hover/a:visible  cursor-pointer`}
                                    onClick={() => {
                                      setPreviewId(data._id)
                                      setCvType('CVUpload')
                                    }}
                                  >
                                    Xem
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className={`relative w-full border border-dashed rounded-small p-4 flex flex-col items-center text-center space-y-4 hover:border-blue transition-all duration-300 cursor-pointer
              ${dragOver || active === 'b' ? 'border-blue' : 'border-gray-light'} ${dragOver ? 'bg-blue-50' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              const file = e.dataTransfer.files[0]
              handleFileChange({ target: { files: [file] } })
            }}
            onClick={() => handleToggle('b')}
          >
            <div
              className={`absolute top-4 left-4 flex items-center justify-center w-5 h-5 rounded-full border-2 ${active === 'b'
                ? 'after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-blue border-blue'
                : 'border-gray'}`}
            ></div>
            <p className="flex items-center font-bold">
              <CloudArrowUpIcon className="w-10 h-10 mr-2 text-gray" /> Tải lên
              CV từ máy tính, chọn hoặc kéo thả
            </p>
            <p className="text-xs text-gray-400">
              Hỗ trợ định dạng .doc, .docx, .pdf kích thước dưới 5MB
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="cvUpload"
            />
            <label
              htmlFor="cvUpload"
              className="px-4 py-2 text-gray-600 transition bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"
            >
              Chọn CV
            </label>
            {form.cv && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">Đã chọn: {form.cv.name}</p>
                <button
                  onClick={async () => {
                    setForm({ ...form, cv: null })
                    await apiFetch(`/cv/uploads/${uploadedCVId}`, 'DELETE')
                  }}
                  className="px-2 py-1.5 text-red bg-red-100 rounded-full transition-colors cursor-pointer"
                >
                  <TrashIcon className='w-4 h-4' />
                </button>
              </div>
            )}
          </div>

          <div className="w-full space-y-2">
            <div className="flex items-center gap-2.5">
              <PaperAirplaneIcon className="w-6 h-6 text-blue" />
              <p className="font-semibold">Thư giới thiệu</p>
            </div>
            <textarea
              name="coverLetter"
              value={coverLetter}
              onChange={(e) => { setCoverLetter(e.target.value) }}
              className="w-full px-4 py-4 text-sm transition-colors duration-300 border rounded-xl border-gray-light focus:outline-none focus:border-blue"
              rows={4}
              placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do bạn muốn ứng tuyển cho vị trí này."
            />
          </div>

          <div className="p-4 border border-gray-light rounded-small">
            <div className="flex items-center gap-2 font-semibold">
              <ExclamationTriangleIcon className="w-5 h-5 text-red" />
              <span className="text-red">Lưu ý:</span>
            </div>
            <p className="mt-2 text-sm">
              Jobiverse khuyên tất cả các bạn hãy luôn cẩn trọng trong quá trình
              tìm việc và chủ động nghiên cứu về thông tin công ty, vị trí việc
              làm trước khi ứng tuyển. Ứng viên cần có trách nhiệm với hành vi
              ứng tuyển của mình. Nếu bạn gặp phải tin tuyển dụng hoặc nhận được
              liên lạc đáng ngờ của nhà tuyển dụng, hãy báo cáo ngay cho
              Jobiverse qua email jobiverse@gmail.com để được hỗ trợ kịp thời.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-between w-full max-w-2xl px-8 py-5 border-t bg-white-bright rounded-br-small rounded-bl-small border-white-low">
          {error && (
            <div className="px-4 py-2 mb-4 text-sm text-red-700 bg-red-100 rounded-small">
              {error}
            </div>
          )}
          <button
            className="flex items-center justify-center w-full p-3 text-white rounded-full cursor-pointer bg-blue"
            onClick={handleSubmit}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? <SpinnerLoading width={6} height={6} /> : 'Nộp hồ sơ ứng tuyển'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApplyPopup
