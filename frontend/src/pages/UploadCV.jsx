import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiFetch from '../services/api'
import BannerText from '../components/BannerText'

const UploadCV = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ cv: null })
  const [error, setError] = useState('')

  const [dragOver, setDragOver] = useState(false) // 👉 THÊM: state theo dõi khi kéo file vào vùng drop

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024) {
        setForm({ ...form, cv: file })
        setError('')
      } else {
        setError('Vui lòng chọn file .pdf, .doc, .docx với kích thước dưới 5MB.')
        setForm({ ...form, cv: null })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.cv) {
      setError('Vui lòng chọn file CV để tải lên.')
      return
    }

    const formData = new FormData()
    formData.append('cv', form.cv)

    try {
      await apiFetch('/upload-cv', 'POST', formData, true)
      alert('CV đã được tải lên thành công!')
      navigate('/CV-Management') //Khi nào làm CV Management thì chỉnh lại
    } catch (err) {
      if (err.message.includes('Unauthorized') || err.message.includes('Token')) {
        setError('Bạn cần đăng nhập để tải CV lên.')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError('Tải CV thất bại, vui lòng thử lại.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <BannerText title="Upload CV" caption="Upload CV để các cơ hội việc làm tự tìm đến bạn"/>

      <div className="w-full py-20">
        <div className="container-responsive">
          <form onSubmit={handleSubmit}>
            <section className="bg-white-bright px-8 py-6 rounded-medium shadow-md">
              <p className="text-black text-sm mb-4">
                Bạn đã có sẵn CV của mình, chỉ cần tải CV lên, hệ thống sẽ tự động đề xuất CV của bạn tới những nhà tuyển dụng uy tín.
                <br />
                Tiết kiệm thời gian, tìm việc thông minh, nắm bắt cơ hội và làm chủ đường đua nghề nghiệp của chính mình.
              </p>
              {/* 👉 THAY: vùng tải file thành vùng kéo & thả */}
              <div
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center text-center space-y-4 transition ${
                  dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
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
              >
                <p className="text-black font-bold">⬆️ Tải lên CV từ máy tính, chọn hoặc kéo thả</p>
                <p className="text-xs text-gray-400">Hỗ trợ định dạng .doc, .docx, .pdf kích thước dưới 5MB</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="cvUpload"
                />
                <label
                  htmlFor="cvUpload"
                  className="cursor-pointer bg-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-300 transition"
                >
                  Chọn CV
                </label>
                {form.cv && <p className="text-sm text-gray-600">Đã chọn: {form.cv.name}</p>}
              </div>
              <div className="text-center mt-6">
                {error && (
                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm mb-4">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  className="bg-blue text-white px-8 py-2 rounded-full hover:bg-blue-600 transition"
                >
                  Tải CV lên
                </button>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UploadCV
