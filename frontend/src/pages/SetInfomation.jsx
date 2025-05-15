import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import apiFetch from '../services/api'
import BannerText from '../components/BannerText'

const SetInfomation = () => {
  const [profile, setProfile] = useState({
    avatar: '',
    name: '',
    mssv: '',
    major: '',
    specialization: '',
    interests: [''],
    university: ''
  })

  const [email, setEmail] = useState('')
  const [majorList, setMajorList] = useState([])
  const [selectedMajor, setSelectedMajor] = useState('')
  const [specList, setSpecList] = useState([''])

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userObj = JSON.parse(storedUser)
      setEmail(userObj.email)
    }

    const loadMajors = async () => {
      try {
        const data = await apiFetch('/majors')
        setMajorList(data)
      } catch (err) {
        console.error('Failed to fetch majors:', err)
      }
    }

    const loadSpec = async () => {
      try {
        const data = await apiFetch('/spec')
        setSpecList(data)
      } catch (err) {
        console.error('Failed to fetch specializations:', err)
      }
    }

    const loadProfile = async () => {
      try {
        const profile = await apiFetch('/students/me')
        if (profile) {
          setProfile(prev => ({
            ...prev,
            avatar: profile.avatar || '',
            name: profile.name || '',
            mssv: profile.mssv || '',
            major: profile.major || '',
            specialization: profile.specialization || '',
            university: profile.university || '',
            interests: profile.interests || ['']
          }))
          setSelectedMajor(profile.major || '')
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      }
    }

    loadMajors()
    loadSpec()
    loadProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!profile.name || !profile.mssv || !profile.university) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.')
      return
    }

    setError('')
    try {
      await apiFetch('/students', 'POST', profile)
      const storedUser = JSON.parse(localStorage.getItem('user'))
      if (storedUser) {
        const updatedUser = {
          ...storedUser,
          avatar: profile.avatar
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      setSuccess('Cập nhật thông tin thành công!')
    } catch (err) {
      setError('Cập nhật thất bại. Vui lòng thử lại.', err.message)
    }
  }

  useEffect(() => {
    if (error) alert(error)
  }, [error])

  useEffect(() => {
    if (success) alert(success)
  }, [success])

  return (
    <div className="min-h-screen">
      <BannerText title="Thông tin cá nhân" caption="Hồ sơ ấn tượng bắt đầu từ những thông tin cá nhân đầy đủ và rõ ràng. Cập nhật chính xác để nhà tuyển dụng có thể dễ dàng kết nối và hiểu rõ tiềm năng của bạn." />

      <div className="flex items-start gap-16 px-6 py-20 mx-auto max-w-7xl">
        <div className="flex-shrink-0 w-1/4">
          <Sidebar />
        </div>

        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <section className="p-10 border border-gray-200 shadow-md bg-white-low rounded-medium">
              <h2 className="mb-2 text-2xl font-bold">Cài đặt thông tin cá nhân</h2>
              <p className="mb-6 text-sm text-black"><span className="text-red-500">(*)</span> Các thông tin bắt buộc</p>

              <div className="space-y-6">
                <div>
                  <label className="block mb-1 text-sm font-bold text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Nguyen Van A"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-bold text-gray-700">Avatar Url <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="avatar"
                    value={profile.avatar}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: https://example.com/avatar.jpg"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-bold text-gray-700">Mã sinh viên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="mssv"
                    value={profile.mssv}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 4551050232"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-bold text-gray-700">Trường <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="university"
                    value={profile.university}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Đại học Quy Nhơn"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-bold text-gray-700">Ngành</label>
                    <select
                      name="major"
                      id="major"
                      value={selectedMajor}
                      onChange={(e) => {
                        const value = e.target.value
                        setSelectedMajor(value)
                        setProfile(prev => ({ ...prev, major: value, specialization: '' }))
                      }}
                      className='w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value="">-- Chọn ngành --</option>
                      {majorList.map((major, index) => (
                        <option key={index} value={major._id}>
                          {major.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-bold text-gray-700">Chuyên Ngành</label>
                    <select
                      name="specialization"
                      id="specialization"
                      value={profile.specialization}
                      onChange={handleChange}
                      className='w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value="">-- Chọn chuyên ngành --</option>
                      {specList.filter(spec => spec.major === selectedMajor).map((spec) => (
                        <option key={spec._id} value={spec._id}>
                          {spec.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-bold text-gray-700">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    readOnly
                    className="w-full px-4 py-2 rounded-full bg-gray-300 text-gray-800 cursor-not-allowed focus:outline-none"
                    placeholder="Email"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue text-white px-6 py-2 rounded-full hover:opacity-90 transition cursor-pointer"
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
