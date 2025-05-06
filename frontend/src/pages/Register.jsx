import React, { useState } from 'react'
import Logo1 from '../assets/Logo1.svg'
import { useNavigate, Link } from 'react-router-dom'
import apiFetch from '../services/api'

const Register = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accountType, setAccountType] = useState('')
  const [acceptPolicy, setAcceptPolicy] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!email || !password || !accountType) {
      setError('Vui lòng điền đầy đủ thông tin.')
      return
    }

    if (!acceptPolicy) {
      setError('Bạn phải đồng ý với Điều khoản & Điều kiện.')
      return
    }

    try {
      await apiFetch('/register', 'POST', {
        email,
        password,
        accountType
      })
      navigate('/login')
    } catch (error) {
      setError('Đăng ký thất bại, vui lòng thử lại.')
      console.error('Đăng ký thất bại', error)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col justify-start items-start w-[660px] p-[60px] gap-5 rounded-medium bg-white-mid my-6">
        <div className="flex justify-center items-center w-[100px] h-[100px] bg-white rounded-full">
          <img src={Logo1} alt="logo1" className="w-[68px]" />
        </div>

        <div className="flex flex-col gap-2.5">
          <h2 className="text-3xl font-bold">Đăng ký tài khoản</h2>
          <p className="font-medium leading-6">
            Tạo tài khoản và bắt đầu sử dụng Jobiverse.
          </p>
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <form onSubmit={handleRegister} className="w-full">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-medium leading-6">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Nhập email của bạn"
                className="w-full h-[50px] px-4 py-2 bg-white-bright rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-medium leading-6">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                placeholder="Nhập mật khẩu của bạn"
                className="w-full h-[50px] px-4 py-2 bg-white-bright rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label name="account" className="font-medium leading-6">
                Loại tài khoản
              </label>
              <select
                name="account"
                className="w-full h-[50px] px-4 py-2 bg-white-bright rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="">Chọn loại tài khoản</option>
                <option value="employer">Nhà tuyển dụng</option>
                <option value="student">Người tìm việc</option>
              </select>
            </div>

            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                name="policy"
                id="policy"
                checked={acceptPolicy}
                onChange={(e) => setAcceptPolicy(e.target.checked)}
              />
              <p className="font-medium leading-6">
                Tôi đã đọc và đồng ý với các{' '}
                <Link to="/register" className="underline text-blue">
                  Điều khoản & Điều kiện.
                </Link>
              </p>
            </div>

            <button
              type="submit"
              className="w-full h-[50px] bg-blue text-white font-bold rounded-full hover:bg-blue-mid transition duration-300"
            >
              Đăng ký
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center w-full">
          <p className="font-medium leading-6">
            Bạn đã có tài khoản?{' '}
            <Link to="/login" className="underline text-blue">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
