import { useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import BannerText from '../components/BannerText'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { UserContext } from '../contexts/UserContext'
import apiFetch from '../services/api'
import Note from '../components/Note'

const Security = () => {
  const { user, setUser } = useContext(UserContext)

  const [loading, setLoading] = useState(true)
  const [hasPassword, setHasPassword] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [phoneLoading, setPhoneLoading] = useState(false)

  const emailRef = useRef(user.email || '')
  const phoneRef = useRef(user.phoneNumber || '')

  const [phone, setPhone] = useState(phoneRef.current)
  const [form, setForm] = useState({
    email: emailRef.current,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        const res = await apiFetch('/account/has-password')
        setHasPassword(res?.hasPassword || false)
      } catch (err) {
        toast.error(`Lỗi tải dữ liệu bảo mật: ${err.message || ''}`)
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  const handleChange = useCallback(({ target: { name, value } }) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }, [])

  const validatePasswordForm = useCallback(() => {
    const { currentPassword, newPassword, confirmNewPassword } = form
    if (newPassword !== confirmNewPassword) {
      toast.error('Mật khẩu mới không khớp')
      return false
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
      return false
    }
    if (hasPassword && !currentPassword) {
      toast.error('Vui lòng nhập mật khẩu hiện tại')
      return false
    }
    return true
  }, [form, hasPassword])

  const handlePasswordSubmit = useCallback(async e => {
    e.preventDefault()

    if (!validatePasswordForm()) return
    setPassLoading(true)

    try {
      await apiFetch('/account/update-password', 'PUT', form)
      toast.success(hasPassword ? 'Đổi mật khẩu thành công!' : 'Thiết lập mật khẩu thành công!')

      const res = await apiFetch('/account/has-password')
      setHasPassword(res?.hasPassword || false)

      setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmNewPassword: '' }))
    } catch (err) {
      toast.error(`Thao tác thất bại: ${err.message || ''}`)
    } finally {
      setPassLoading(false)
    }
  }, [form, hasPassword, validatePasswordForm])

  const handlePhoneSubmit = useCallback(async e => {
    e.preventDefault()
    if (!/^\d{10,11}$/.test(phone)) {
      toast.error('Số điện thoại không hợp lệ')
      setPhone(phoneRef.current)
      return
    }

    setPhoneLoading(true)
    try {
      await apiFetch('/account/update-phone', 'PUT', { phone })
      toast.success('Cập nhật số điện thoại thành công!')
      setUser(u => ({ ...u, phoneNumber: phone }))
      phoneRef.current = phone
    } catch (err) {
      toast.error(`Cập nhật thất bại: ${err.message || ''}`)
      setPhone(phoneRef.current)
    } finally {
      setPhoneLoading(false)
    }
  }, [phone, setUser])

  const passwordFields = useMemo(() => [
    { label: 'Email đăng nhập', name: 'email', type: 'email', readOnly: true, visible: true },
    { label: 'Mật khẩu hiện tại', name: 'currentPassword', type: 'password', visible: hasPassword },
    { label: 'Mật khẩu mới', name: 'newPassword', type: 'password', visible: true },
    { label: 'Nhập lại mật khẩu mới', name: 'confirmNewPassword', type: 'password', visible: true }
  ], [hasPassword])

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <BannerText title="Cài đặt bảo mật" caption="Thay đổi mật khẩu tài khoản của bạn tại đây." />

      <div className="flex items-start gap-16 px-6 py-20 mx-auto max-w-7xl">
        <aside className="flex-shrink-0 w-1/4"><Sidebar /></aside>

        {loading ? (
          <div className="flex items-center justify-center w-full h-60">
            <p className="text-lg text-gray-500">Đang tải dữ liệu bảo mật...</p>
          </div>
        ) : (
          <section className="w-full p-10 border border-gray-200 shadow-md bg-white-low rounded-medium">
            <h2 className="mb-6 text-lg font-semibold">
              {hasPassword ? 'Thay đổi mật khẩu' : 'Thiết lập mật khẩu'}
            </h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordFields.filter(f => f.visible).map(({ name, label, type, readOnly }) => (
                <div key={name} className="flex items-center gap-6">
                  <label htmlFor={name} className="w-1/4 font-medium text-right">{label}</label>
                  <input
                    id={name} name={name} type={type}
                    value={form[name]}
                    onChange={handleChange}
                    readOnly={readOnly}
                    required={!readOnly}
                    placeholder={readOnly ? undefined : 'Nhập mật khẩu'}
                    className={`w-full border border-gray-200 px-4 py-2 rounded-md
                      ${readOnly ? 'bg-gray-300 text-gray-800 cursor-not-allowed' : 'bg-white'}`}
                  />
                </div>
              ))}

              {!hasPassword && (
                <div className="flex justify-start pl-[calc(25%-1.5rem)] mt-6">
                  <Note content="Chưa có mật khẩu? Bạn có thể thiết lập mật khẩu mới để bảo vệ tài khoản của mình." />
                </div>
              )}

              <div className="flex justify-start pl-[calc(25%-1.5rem)] mt-6">
                <button type="submit" disabled={passLoading}
                  className="px-5 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50">
                  {passLoading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>

            <hr className="my-10" />

            <h2 className="mb-6 text-lg font-semibold">
              {phoneRef.current ? 'Cập nhật số điện thoại' : 'Thêm số điện thoại'}
            </h2>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="flex items-center gap-6">
                <label htmlFor="phone" className="w-1/4 font-medium text-right">Số điện thoại</label>
                <input
                  id="phone" name="phone" type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại mới"
                  required
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md"
                />
              </div>

              {!phoneRef.current && (
                <div className="flex justify-start pl-[calc(25%-1.5rem)] mt-6">
                  <Note content="Chưa có số điện thoại? Bạn có thể thiết lập số điện thoại để bảo vệ tài khoản của mình." />
                </div>
              )}

              <div className="flex justify-start pl-[calc(25%-1.5rem)] mt-6">
                <button type="submit" disabled={phoneLoading}
                  className="px-5 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">
                  {phoneLoading ? 'Đang lưu...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  )
}

export default Security
