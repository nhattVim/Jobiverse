import { React, useState } from 'react'
import Logo1 from '../assets/Logo1.svg'
import { useNavigate, Link } from 'react-router-dom'
import apiFetch from '../services/api'
import { ROUTES } from '../routes/routePaths'

const Login = () => {
  const navigate = useNavigate()
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!emailOrPhone.trim()) return setError('Email hoặc số điện thoại không được để trống')
    if (!password.trim()) return setError('Mật khẩu không được để trống')

    try {
      await apiFetch('/login', 'POST', {
        emailOrPhone,
        password
      })

      const user = await apiFetch('/account/detail', 'GET')
      localStorage.setItem('user', JSON.stringify(user))

      navigate('/')
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại, vui lòng thử lại.')
      console.error('Đăng nhập thất bại', error)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col justify-start items-start w-[660px] p-[60px] gap-5 rounded-medium bg-white-mid">
        <div className="flex justify-center items-center w-[100px] h-[100px] bg-white rounded-full">
          <img src={Logo1} alt="logo1" className="w-[68px]" />
        </div>

        <div className="flex flex-col gap-2.5">
          <h2 className="text-3xl font-bold">Đăng nhập ở đây</h2>
          <p className="font-medium leading-6">
            Điền vào email và mật khẩu của bạn để đăng nhập.
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <form onSubmit={handleLogin} className="w-full">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-medium leading-6">
                Email
              </label>
              <input
                type="text"
                id="emailOrPhone"
                placeholder="Nhập email hoặc số điẹn thoại của bạn"
                className="w-full h-[50px] px-4 py-2 bg-white-bright rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
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
            <button
              type="submit"
              className="w-full h-[50px] bg-blue text-white font-bold rounded-full hover:bg-blue-mid transition duration-300 cursor-pointer"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between w-full">
          <p className="font-medium leading-6">
            Bạn chưa có tài khoản?{' '}
            <Link to={ROUTES.REGISTER} className="underline text-blue">
              Đăng ký
            </Link>
          </p>
          <Link to="/" className="font-medium leading-6 underline text-blue">
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
