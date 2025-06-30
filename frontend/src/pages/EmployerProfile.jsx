import React, { useContext, useState } from 'react'
import Profile from '../components/Profile'
import { useNavigate } from 'react-router-dom'
import apiFetch from '../services/api'
import SpinnerLoading from '../shared/loading/SpinnerLoading'
import { UserContext } from '../contexts/UserContext'

const EmployerProfile = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    representativeName: '',
    companyName: '',
    industry: '',
    position: '',
    companyInfo: '',
    businessScale: '',
    prove: '',
    address: ''
  })
  const { setUser, updateTimestamp } = useContext(UserContext)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const requiredFields = ['representativeName', 'companyName', 'position']
    for (const field of requiredFields) {
      if (!form[field]) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc.')
        return
      }
    }

    setLoading(true)

    try {
      await apiFetch('/employers/me', 'POST', form)
      await apiFetch('/account/profile', 'PUT')
      const user = await apiFetch('/account/detail', 'GET')
      updateTimestamp()
      navigate('/')
      setTimeout(() => setUser(user), 1000)
    } catch (err) {
      console.error(err)
      setError('Tạo profile thất bại, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Profile
      title="Tạo profile cho nhà tuyển dụng"
      caption="Bắt đầu hành trình tuyển dụng hiệu quả bằng cách xây dựng hồ sơ nhà tuyển dụng rõ ràng, uy tín và hấp dẫn."
    >
      <form onSubmit={handleSubmit} className="pb-20">
        <section className="p-10 border border-gray-200 shadow-md bg-white-low rounded-medium">
          <h2 className="mb-6 text-xl font-bold">Thông tin nhà tuyển dụng</h2>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="space-y-4">
            {/* Họ và tên HR */}
            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">
                Họ và tên
              </label>
              <input
                type="text"
                name="representativeName"
                value={form.representativeName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                placeholder="Nhập tên của HR"
              />
            </div>

            {/* Tên công ty */}
            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">
                Công ty
              </label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                placeholder="Tên công ty"
              />
            </div>

            {/* Lĩnh vực & Vị trí */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Lĩnh vực
                </label>
                <input
                  type="text"
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Lĩnh vực công ty"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Chức vụ công tác
                </label>
                <input
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Chức vụ"
                />
              </div>
            </div>

            {/* Mô tả công ty */}
            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">
                Mô tả công ty
              </label>
              <textarea
                type="text"
                name="companyInfo"
                value={form.companyInfo}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
                placeholder="Mô tả"
              />
            </div>

            {/* Quy mô doanh nghiệp & Mã số thuế */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Quy mô doanh nghiệp
                </label>
                <select
                  name="businessScale"
                  value={form.businessScale}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                >
                  <option value="">-- Chọn -- </option>
                  <option value="Private individuals">Cá nhân</option>
                  <option value="Companies">Doanh nghiệp</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Mã số thuế
                </label>
                <input
                  type="number"
                  name="prove"
                  value={form.prove}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Nhập mã số thuế"
                />
              </div>
            </div>

            {/* Địa chỉ công ty */}
            <div>
              <label className="block mb-1 text-sm font-bold text-gray-700">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                placeholder="Nhập địa chỉ"
              />
            </div>

            {/* Nút submit */}
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="px-6 py-2 text-white transition rounded-full cursor-pointer bg-red hover:bg-red-700">
                Huỷ
              </button>
              <button
                type="submit"
                className="relative px-6 py-2 text-white transition rounded-full cursor-pointer bg-blue hover:bg-blue-700 disabled:bg-blue-700"
                disabled={loading}
              >
                <span className={`${loading ? 'invisible' : 'visible'}`}>Hoàn tất</span>
                {loading && <SpinnerLoading width={6} height={6} className={'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'} />}
              </button>
            </div>
          </div>
        </section>
      </form>
    </Profile>
  )
}

export default EmployerProfile
