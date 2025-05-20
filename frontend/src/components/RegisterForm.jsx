import React, { useState } from 'react'
import Logo1 from '../assets/Logo1.svg'
import { useNavigate, Link } from 'react-router-dom'
import apiFetch from '../services/api'
import { GoogleLogin } from '@react-oauth/google'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

const RegisterForm = ({ accountType, onBack }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [acceptPolicy, setAcceptPolicy] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) return setError('Email không được để trống')
    if (!phone.trim()) return setError('Số điện thoại không được để trống')
    if (!password.trim()) return setError('Mật khẩu không được để trống')
    if (!acceptPolicy) return setError('Bạn phải đồng ý với Điều khoản & Điều kiện.')

    try {
      await apiFetch('/register', 'POST', {
        method: 'email',
        email,
        phoneNumber: phone,
        password,
        accountType
      })
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại, vui lòng thử lại.')
    }
  }

  const handleGoogleRegister = async (credentialResponse) => {
    try {
      await apiFetch('/register', 'POST', {
        method: 'google',
        accountType,
        ggToken: credentialResponse.credential
      })
      navigate('/login')
    } catch (err) {
      setError('Đăng ký bằng Google thất bại.')
      console.error('Google login error:', err.message)
    }
  }

  const handleFacebookRegister = () => {
    if (!window.FB) {
      setError('Facebook SDK chưa sẵn sàng. Vui lòng thử lại sau.')
      return
    }

    window.FB.login(
      (response) => {
        if (!response.authResponse || !response.authResponse.accessToken) {
          setError('Đăng ký bằng Facebook thất bại hoặc bạn đã hủy.')
          return
        }

        const accessToken = response.authResponse.accessToken
        handleFacebookRegisterAsync(accessToken)
      },
      { scope: 'public_profile,email' }
    )
  }

  const handleFacebookRegisterAsync = async (accessToken) => {
    try {
      await apiFetch('/register', 'POST', {
        method: 'facebook',
        accountType,
        fbToken: accessToken
      })
      navigate('/login')
    } catch (err) {
      setError('Đăng ký bằng Facebook thất bại.')
      console.error('Facebook login error:', err)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col w-[660px] p-[60px] gap-5 rounded bg-white-mid my-6">
        <div className="flex justify-center items-center w-[100px] h-[100px] bg-white rounded-full">
          <img src={Logo1} alt="logo" className="w-[68px]" />
        </div>

        <h2 className="text-3xl font-bold">Đăng ký tài khoản</h2>
        <p className="mb-4 font-medium leading-6">
          Tạo tài khoản và bắt đầu sử dụng Jobiverse.
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email của bạn"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Số điện thoại của bạn"
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={acceptPolicy}
              onChange={(e) => setAcceptPolicy(e.target.checked)}
            />
            Tôi đồng ý với{' '}
            <Link to="/register" className="underline text-blue">
              Điều khoản & Điều kiện
            </Link>
          </label>

          <button
            type="submit"
            className="w-full h-[50px] bg-blue text-white font-bold rounded-full hover:bg-blue-mid transition duration-300 cursor-pointer"
          >
            Đăng ký
          </button>
        </form>

        <div className="flex items-center w-full gap-4 my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="text-sm text-gray-500 whitespace-nowrap">Or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="flex flex-col items-center gap-4">
          <GoogleLogin
            onSuccess={handleGoogleRegister}
            onError={() => setError('Đăng ký bằng Google thất bại')}
          />

          <FacebookLogin
            appId="1206494790558399"
            fields="name,email,picture"
            callback={handleFacebookRegister}
            render={renderProps => (
              <button
                onClick={renderProps.onClick}
                className="px-6 bg-white h-[50px] flex items-center justify-center gap-3 border border-gray-300 text-black font-medium rounded-lg hover:bg-gray-100 transition"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
                <span>Đăng ký bằng Facebook</span>
              </button>
            )}
          />
        </div>

        <p className="mt-6 text-center">
          Bạn đã có tài khoản?{' '}
          <Link to="/login" className="underline text-blue">
            Đăng nhập
          </Link>
        </p>

        {onBack && (
          <button
            onClick={onBack}
            className="mb-2 -mt-4 text-sm underline text-blue hover:text-blue-800"
          >
            ← Quay lại chọn loại tài khoản
          </button>
        )}
      </div>
    </div>
  )
}

export default RegisterForm
