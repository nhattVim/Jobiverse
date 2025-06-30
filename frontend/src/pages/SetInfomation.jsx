import React, { useState, useEffect, useContext } from 'react'
import Sidebar from '../components/Sidebar'
import apiFetch from '../services/api'
import BannerText from '../components/BannerText'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { UserContext } from '../contexts/UserContext'
import EmployerInfo from '../components/EmployerInfo'
import StudentInfo from '../components/StudentInfo'

const defaultProfiles = {
  student: {
    name: '',
    mssv: '',
    major: '',
    specialization: '',
    university: '',
    interests: ['']
  },
  employer: {
    companyName: '',
    representativeName: '',
    position: '',
    companyInfo: '',
    businessScale: '',
    industry: '',
    address: '',
    prove: '',
    interests: ['']
  }
}

const SetInformation = () => {
  const [profile, setProfile] = useState({})
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const { user, setUser } = useContext(UserContext)

  const fetchProfile = async (type, endpoint) => {
    const profileData = await apiFetch(endpoint)
    if (!profileData) return

    const defaultData = defaultProfiles[type]
    const filledProfile = Object.fromEntries(
      Object.entries(defaultData).map(([key, defaultValue]) => [
        key,
        profileData[key] ?? defaultValue
      ])
    )
    setProfile(filledProfile)
  }

  useEffect(() => {
    setEmail(user?.email || '')
    if (!user?.role) return

    const loadData = async () => {
      setLoading(true)
      try {
        if (user.role === 'student') {
          await fetchProfile('student', '/students/me')
        } else if (user.role === 'employer') {
          await fetchProfile('employer', '/employers/me')
        }
      } catch (err) {
        console.error('Fetch data failed:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingSubmit(true)
    try {
      const endpoint =
        user.role === 'student' ? '/students/me' : '/employers/me'
      await apiFetch(endpoint, 'PUT', profile)

      const userDetail = await apiFetch('/account/detail', 'GET')
      setUser(userDetail)

      toast.success('Cập nhật thông tin thành công!')
    } catch (err) {
      console.error(err)
      toast.error('Cập nhật thất bại. Vui lòng thử lại.')
    } finally {
      setLoadingSubmit(false)
    }
  }

  const renderForm = () => {
    if (user.role === 'student') {
      return (
        <StudentInfo
          profile={profile}
          email={email}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loadingSubmit={loadingSubmit}
          setProfile={setProfile}
        />
      )
    } else if (user.role === 'employer') {
      return (
        <EmployerInfo
          profile={profile}
          email={email}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loadingSubmit={loadingSubmit}
        />
      )
    } else {
      return null
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
          ) : (
            renderForm()
          )}
        </div>
      </div>
    </div>
  )
}

export default SetInformation
