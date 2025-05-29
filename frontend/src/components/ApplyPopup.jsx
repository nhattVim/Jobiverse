import {
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  FolderPlusIcon,
  XMarkIcon
} from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import apiFetch from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'

const ApplyPopup = ({ setIsOpen, applyTitle }) => {
  const [cvList, setCvList] = useState([])
  const [cvUploads, setCvUploads] = useState([])
  const [form, setForm] = useState({ cv: null })
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [active, setActive] = useState('a')

  const handleToggle = (key) => {
    if (key !== active) {
      setActive(key)
    }
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
      } else {
        setError(
          'Vui lòng chọn file .pdf, .doc, .docx với kích thước dưới 5MB.'
        )
        setForm({ ...form, cv: null })
      }
    }
  }

  useEffect(() => {
    const loadCV = async () => {
      try {
        const [cvOnline, cvUpload] = await Promise.all([
          apiFetch('/cv', 'GET'),
          apiFetch('/cv/uploads', 'GET')
        ])
        setCvList(cvOnline)
        setCvUploads(cvUpload)
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu CV:', err)
      }
    }

    loadCV()
  }, [])
  return (
    <div className="fixed z-[999] inset-0 flex justify-center items-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 bg-white-bright min-h-[90%] mx-auto shadow-lg w-full max-w-2xl rounded-small animate-slideUp">
        <div className="fixed z-50 max-w-2xl w-full flex items-center px-8 py-5 justify-between shadow">
          <h6 className="text-xl font-semibold">
            Ứng tuyển <span className="text-blue">{applyTitle}</span>
          </h6>
          <div
            onClick={() => setIsOpen(false)}
            className="font-bold text-gray-dark bg-white-mid p-1 rounded-full hover:bg-blue-100 hover:text-blue cursor-pointer"
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
            className={`${
              active === 'a' ? 'border-blue' : 'border-gray-light'
            } border w-full p-4 rounded-small text-sm transition-all duration-300`}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => handleToggle('a')}
                className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${
                  active === 'a'
                    ? 'after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-blue border-blue'
                    : 'border-gray'
                }`}
              ></div>
              <p className="font-semibold">Chọn CV trong thư viện CV của tôi</p>
            </div>
            <AnimatePresence initial={false}>
              {active === 'a' && (
                <motion.div
                  key={'a'}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-2 overflow-hidden"
                >
                  <p className="font-semibold mt-4">CV Online</p>
                  {cvList.map((data) => (
                    <div
                      key={data._id}
                      className="px-4 py-3 border border-gray-light hover:border-blue rounded-small cursor-pointer"
                    >
                      {data.title || 'Chưa đặt tên'}
                    </div>
                  ))}

                  <p className="font-semibold">CV đã tải lên</p>
                  {cvUploads.map((data) => (
                    <div
                      key={data._id}
                      className="px-4 py-3 border border-gray-light hover:border-blue rounded-small cursor-pointer"
                    >
                      {data.title || 'Chưa đặt tên'}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className={`relative w-full border border-dashed rounded-small p-4 flex flex-col items-center text-center space-y-4 transition-all duration-300 cursor-pointer ${
              dragOver || active === 'b' ? 'border-blue' : 'border-gray-light'
            } ${dragOver ? 'bg-blue-50' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              const file = e.dataTransfer.files[0]
              handleFileChange({ target: { files: [file] } }) // xử lý giống input
            }}
            onClick={() => handleToggle('b')}
          >
            <div
              className={`absolute top-4 left-4 flex items-center justify-center w-5 h-5 rounded-full border-2 ${
                active === 'b'
                  ? 'after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-blue border-blue'
                  : 'border-gray'
              }`}
            ></div>
            <p className="font-bold flex items-center">
              <CloudArrowUpIcon className="w-10 h-10 text-gray mr-2" /> Tải lên
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
              <p className="text-sm text-gray-600">Đã chọn: {form.cv.name}</p>
            )}

            <AnimatePresence initial={false}>
              {active === 'b' && (
                <motion.div
                  key={'b'}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col gap-2 p-2 border-t border-white-mid overflow-hidden"
                >
                  <p className='text-blue text-sm text-left'>Vui lòng nhập đầy đủ thông tin chi tiết:</p>
                  <div>
                    <label className="block mb-1 text-sm text-left">Họ và tên</label>
                    <input
                      type="text"
                      name=""
                      value={''}
                      onChange={''}
                      className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-1 focus:ring-blue text-sm"
                      placeholder="Họ và tên"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-1 text-sm text-left">Email</label>
                      <input
                        type="email"
                        name=""
                        value={''}
                        onChange={''}
                        className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-1 focus:ring-blue text-sm"
                        placeholder="Email"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm text-left">Số điện thoại</label>
                      <input
                        type="text"
                        name=""
                        value={''}
                        onChange={''}
                        className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-1 focus:ring-blue text-sm"
                        placeholder="Số điện thoại"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 border border-gray-light rounded-small">
            <div className="flex items-center gap-2 font-semibold">
              <ExclamationTriangleIcon className="w-5 h-5 text-red" />
              <span className="text-red">Lưu ý:</span>
            </div>
            <p className="text-sm mt-2">
              Jobiverse khuyên tất cả các bạn hãy luôn cẩn trọng trong quá trình
              tìm việc và chủ động nghiên cứu về thông tin công ty, vị trí việc
              làm trước khi ứng tuyển. Ứng viên cần có trách nhiệm với hành vi
              ứng tuyển của mình. Nếu bạn gặp phải tin tuyển dụng hoặc nhận được
              liên lạc đáng ngờ của nhà tuyển dụng, hãy báo cáo ngay cho
              Jobiverse qua email jobiverse@gmail.com để được hỗ trợ kịp thời.
            </p>
          </div>
        </div>

        <div className="absolute bg-white-bright rounded-br-small rounded-bl-small z-20 bottom-0 right-0 left-0 max-w-2xl w-full flex items-center px-8 py-5 justify-between border-t border-white-low">
          <button className="text-white bg-blue p-3 w-full rounded-full cursor-pointer">
            Nộp hồ sơ ứng tuyển
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApplyPopup
