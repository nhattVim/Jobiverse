import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import apiFetch from '../services/api'
import BannerText from '../components/BannerText'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const SetInfomation = () => {
  const [profile, setProfile] = useState({
    name: '',
    mssv: '',
    major: '',
    specialization: '',
    interests: [''],
    university: ''
  })

  const [email, setEmail] = useState('')
  const [majorList, setMajorList] = useState([])
  const [specList, setSpecList] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userObj = JSON.parse(storedUser)
      setEmail(userObj.email)
    }

    const loadData = async () => {
      setLoading(true)
      try {
        const [majorsData, specsData, profileData] = await Promise.all([
          apiFetch('/majors'),
          apiFetch('/specs'),
          apiFetch('/students/me')
        ])

        setMajorList(majorsData)
        setSpecList(specsData)

        if (profileData) {
          setProfile({
            name: profileData.name || '',
            mssv: profileData.mssv || '',
            major: profileData.major || '',
            specialization: profileData.specialization || '',
            university: profileData.university || '',
            interests: profileData.interests || ['']
          })
        }
      } catch (err) {
        console.error('Fetch data failed:', err)
        setFetchError('Không tải được dữ liệu. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!profile.name.trim() || !profile.mssv.trim() || !profile.university.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.')
      return
    }

    setLoadingSubmit(true)
    try {
      await apiFetch('/students', 'POST', profile)
      toast.success('Cập nhật thông tin thành công!')
    } catch (err) {
      console.error(err)
      toast.error('Cập nhật thất bại. Vui lòng thử lại.')
    } finally {
      setLoadingSubmit(false)
    }
  }

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <BannerText
        title="Thông tin cá nhân"
        caption="Hồ sơ ấn tượng bắt đầu từ những thông tin cá nhân đầy đủ và rõ ràng. Cập nhật chính xác để nhà tuyển dụng có thể dễ dàng kết nối và hiểu rõ tiềm năng của bạn."
      />

      <div className="flex items-start gap-16 px-6 py-20 mx-auto max-w-7xl">
        <div className="flex-shrink-0 w-1/4">
          <Sidebar />
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center w-full h-full p-10">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : fetchError ? (
            <div className="flex items-center justify-center w-full h-full p-10">
              <p className="text-red-600">{fetchError}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <section className="p-10 border border-gray-200 shadow-md bg-white-low rounded-medium">
                <h2 className="mb-2 text-2xl font-bold">Cài đặt thông tin cá nhân</h2>
                <p className="mb-6 text-sm text-black">
                  <span className="text-red-500">*</span> Các thông tin bắt buộc
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block mb-1 text-sm font-bold text-gray-700">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
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
                    <label className="block mb-1 text-sm font-bold text-gray-700">
                      Mã sinh viên <span className="text-red-500">*</span>
                    </label>
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
                    <label className="block mb-1 text-sm font-bold text-gray-700">
                      Trường <span className="text-red-500">*</span>
                    </label>
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
                        value={profile.major}
                        onChange={e =>
                          setProfile(prev => ({ ...prev, major: e.target.value, specialization: '' }))
                        }
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Chọn ngành --</option>
                        {majorList.map((major) => (
                          <option key={major._id} value={major._id}>
                            {major.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-bold text-gray-700">Chuyên Ngành</label>
                      <select
                        name="specialization"
                        value={profile.specialization}
                        onChange={e =>
                          setProfile(prev => ({ ...prev, specialization: e.target.value }))
                        }
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Chọn chuyên ngành --</option>
                        {specList
                          .filter(spec => spec.major === profile.major)
                          .map((spec) => (
                            <option key={spec._id} value={spec._id}>
                              {spec.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-bold text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      readOnly
                      className="w-full px-4 py-2 text-gray-800 bg-gray-300 rounded-full cursor-not-allowed focus:outline-none"
                      placeholder="Email"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingSubmit}
                    className={`px-6 py-2 text-white transition rounded-full cursor-pointer bg-blue hover:opacity-90 ${loadingSubmit ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {loadingSubmit ? 'Đang lưu...' : 'Lưu lại'}
                  </button>
                </div>
              </section>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default SetInfomation
