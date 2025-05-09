import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import apiFetch from '../services/api'
import BannerText from '../components/BannerText'

const SetInfomation = () => {
  const [form, setForm] = useState({
    name: '',
    studentId: '',
    school: '',
    jobType: '',
    phoneNumber: '',
    email: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Lấy email từ localStorage khi load trang
  useEffect(() => {
    const userEmail = localStorage.getItem('email') // cần đảm bảo login xong có lưu email
    if (userEmail) {
      setForm(prevForm => ({ ...prevForm, email: userEmail }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.studentId || !form.school || !form.phoneNumber || !form.email) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.')
      return
    }

    setError('')
    try {
      await apiFetch('/users/update', 'POST', form) //Gọi API cập nhật thông tin
      setSuccess('Cập nhật thông tin thành công!')
    } catch (err) {
      setError('Cập nhật thất bại. Vui lòng thử lại.')
    }
  }

  return (
    <div className="min-h-screen">
      <BannerText title="Thông tin cá nhân" caption="Hồ sơ ấn tượng bắt đầu từ những thông tin cá nhân đầy đủ và rõ ràng. Cập nhật chính xác để nhà tuyển dụng có thể dễ dàng kết nối và hiểu rõ tiềm năng của bạn."/>

      <div className="max-w-7xl mx-auto flex py-20 px-6 gap-16 items-start">
        <div className="w-1/4 flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1">
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          {success && <p className="text-sm text-green-600 mb-4">{success}</p>}

          <form onSubmit={handleSubmit}>
            <section className="bg-white-low p-10 rounded-medium shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-2">Cài đặt thông tin cá nhân</h2>
              <p className="text-sm text-black mb-6"><span className="text-red-500">(*)</span> Các thông tin bắt buộc</p>

              <div className="space-y-6">
                <div>
                  <label className="font-bold block text-gray-700 text-sm mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Nguyen Van A"
                  />
                </div>

                <div>
                  <label className="font-bold block text-gray-700 text-sm mb-1">Mã sinh viên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 4551050232"
                  />
                </div>

                <div>
                  <label className="font-bold block text-gray-700 text-sm mb-1">Trường <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="school"
                    value={form.school}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Đại học Quy Nhơn"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold block text-gray-700 text-sm mb-1">Ngành</label>
                    <input
                      type="text"
                      name="jobType"
                      value={form.jobType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: Công nghệ thông tin"
                    />
                  </div>

                  <div>
                    <label className="font-bold block text-gray-700 text-sm mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: 0123456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold block text-gray-700 text-sm mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    readOnly
                    className="w-full px-4 py-2 rounded-full bg-gray-300 text-gray-800 cursor-not-allowed"
                    placeholder="Email"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition"
                >
                  Lưu lại
                </button>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SetInfomation
