import { React, useState, useContext } from 'react'
import Logo1 from '../assets/Logo1.svg'
import { useNavigate, Link } from 'react-router-dom'
import apiFetch from '../services/api'
import { GoogleLogin } from '@react-oauth/google'
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/solid'
import { ROUTES } from '../routes/routePaths'
import { UserContext } from '../contexts/UserContext'

const Login = () => {
  const navigate = useNavigate()
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const { setUser, updateTimestamp } = useContext(UserContext)

  const handleContinue = () => {
    if (!emailOrPhone.trim()) return setError('Vui lòng nhập email hoặc số điện thoại')
    setError('')
    setStep(2)
  }

  const handleStepBack = () => {
    setStep(1)
    setPassword('')
    setError('')
  }

  const handleAfterLogin = async () => {
    const user = await apiFetch('/account/detail', 'GET')
    setUser(user)
    updateTimestamp()

    if (!user.profile && user.role === 'employer') {
      navigate(ROUTES.EMPLOYER_PROFILE)
    } else if (!user.profile && user.role === 'student') {
      navigate(ROUTES.STUDENT_PROFILE)
    } else {
      navigate(ROUTES.HOME)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!emailOrPhone.trim()) return setError('Email hoặc số điện thoại không được để trống')
    if (!password.trim()) return setError('Mật khẩu không được để trống')

    try {
      await apiFetch('/login', 'POST', {
        authProvider: 'local',
        emailOrPhone,
        password
      })
      handleAfterLogin()
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại, vui lòng thử lại.')
      console.error('Đăng nhập thất bại', error)
    }
  }

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      await apiFetch('/login', 'POST', {
        authProvider: 'google',
        ggToken: credentialResponse.credential
      })
      handleAfterLogin()
    } catch (err) {
      setError('Đăng nhập thất bại. ' + err.message)
      console.error('Google login error:', err)
    }
  }

  const handleFacebookLogin = () => {
    window.FB.login(response => {
      if (!response.authResponse?.accessToken) {
        setError('Đăng nhập bằng Facebook thất bại.')
        return
      }

      handleFacebookLoginAsync(response.authResponse.accessToken)
    }, { scope: 'public_profile,email' })
  }

  const handleFacebookLoginAsync = async (accessToken) => {
    try {
      await apiFetch('/login', 'POST', {
        authProvider: 'facebook',
        fbToken: accessToken
      })
      handleAfterLogin()
    } catch (err) {
      setError('Đăng nhập bằng Facebook thất bại.')
      console.error('Facebook login error:', err)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col justify-start items-start w-[660px] p-[60px] gap-5 rounded-medium bg-white-mid">
        <div className="flex justify-center items-center w-[100px] h-[100px] bg-white rounded-full">
          <img src={Logo1} alt="logo1" className="w-[68px]" />
        </div>

        <div className="flex flex-col gap-2.5">
          <h2 className="text-3xl font-bold">Đăng nhập ở đây</h2>
          <p className="font-medium leading-6">
            {step === 1
              ? 'Điền vào email hoặc số điện thoại của bạn để tiếp tục.'
              : step === 2
                ? 'Nhập mật khẩu của bạn để tiếp tục.'
                : ''}
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <form onSubmit={handleLogin} className="w-full">
          <div className="flex flex-col gap-5">

            {/* Bước 1: Nhập email hoặc số điện thoại */}
            {step === 1 && (
              <>
                <div className="flex flex-col gap-1.5">
                  <div className="relative w-full">
                    <UserIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none left-4 top-1/2" />
                    <input
                      type="text"
                      id="emailOrPhone"
                      placeholder="Nhập email hoặc số điện thoại"
                      className="w-full h-[50px] pl-12 pr-4 py-2 bg-white-bright rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (!emailOrPhone.trim()) {
                            setError('Vui lòng nhập email hoặc số điện thoại')
                          } else {
                            setError('')
                            setStep(2)
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full h-[50px] bg-blue text-white font-bold rounded-full hover:bg-blue-mid transition"
                >
                  Tiếp tục
                </button>
              </>
            )}

            {/* Bước 2: Nhập mật khẩu */}
            {step === 2 && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="font-medium leading-6">
                    Mật khẩu
                  </label>
                  <div className="relative w-full">
                    <LockClosedIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none left-4 top-1/2" />
                    <input
                      type="password"
                      id="password"
                      placeholder="Nhập mật khẩu"
                      className="w-full h-[50px] pl-12 pr-4 py-2 bg-white-bright rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-[50px] bg-blue text-white font-bold rounded-full hover:bg-blue-mid transition"
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={handleStepBack}
                  className="underline text-blue"
                >
                  Quay lại
                </button>
              </>
            )}
          </div>
        </form>

        {step === 1 && (
          <>
            <div className="flex items-center w-full gap-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="text-sm text-gray-500 whitespace-nowrap">Or</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <div className="flex flex-col items-center w-full gap-4">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError('Đăng nhập bằng Google thất bại')}
              />

              <button
                onClick={handleFacebookLogin}
                className="px-6 bg-white h-[50px] flex items-center justify-center gap-3 border border-gray-300 text-black font-medium rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
                <span>Tiếp tục với Facebook</span>
              </button>
            </div>

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
          </>
        )}
      </div>
    </div>
  )
}

export default Login
