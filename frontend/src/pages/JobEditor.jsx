import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiFetch from '../services/api'
import BannerText from '../components/BannerText'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Editor } from '@tinymce/tinymce-react'

const animatedComponents = makeAnimated()

const JobEditor = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(!!id)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [majors, setMajors] = useState([])
  const [specs, setSpecs] = useState([])
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: {
      province: '',
      district: '',
      ward: ''
    },
    major: [],
    specialization: [],
    content: '',
    workingTime: '',
    salary: '',
    expRequired: '',
    deadline: '',
    hiringCount: '',
    workType: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const data = await apiFetch(`/projects/detail/${id}`, 'GET')
          console.log('Fetched job data:', data)
          setForm(data)
        } catch (err) {
          setError('Không tải được bài đăng: ' + err.message)
          navigate('/job-list')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
  }

  const handleProvinceChange = (provinceName) => {
    const selectedProvince = provinces.find((p) => p.name === provinceName)
    setForm((prev) => ({
      ...prev,
      location: {
        province: provinceName,
        district: '',
        ward: ''
      }
    }))
    setDistricts(selectedProvince?.districts || [])
    setWards([])
  }

  const handleDistrictChange = (districtName) => {
    const selectedDistrict = districts.find((d) => d.name === districtName)
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        district: districtName,
        ward: ''
      }
    }))
    setWards(selectedDistrict?.wards || [])
  }

  const handleWardChange = (wardName) => {
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        ward: wardName
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const requiredFields = ['title', 'location', 'salary', 'description']
    for (const field of requiredFields) {
      if (!form[field]) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc.')
        return
      }
    }

    try {
      if (id) {
        await apiFetch(`/projects/my/${id}`, 'PUT', form)
        navigate('/job-list')
      } else {
        await apiFetch('/projects/my', 'POST', form)
        navigate('/job-list')
      }
    } catch (err) {
      setError('Tạo bài đăng thất bại, vui lòng thử lại.' + err.message)
    }
  }

  useEffect(() => {
    if (error) toast.error(error)
    setError('')
  }, [error])

  useEffect(() => {
    const fetchData = async () => {
      const majorData = await apiFetch('/majors', 'GET')
      const specData = await apiFetch('/specs', 'GET')
      const locationData = await apiFetch('/openapi/locations')
      setMajors(majorData)
      setSpecs(specData)
      setProvinces(locationData)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center w-full h-screen pb-[104px]">
      <p>Đang tải Job...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <BannerText
        title="Đăng một công việc"
        caption="Đưa công việc của bạn đến gần hơn với những người phù hợp. Một tin đăng chuẩn chỉnh sẽ giúp bạn tiết kiệm thời gian và nhanh chóng tiếp cận nhân sự chất lượng."
      />

      <div className="w-full max-w-4xl py-20 mx-auto space-y-6">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit}>
          <section className="p-10 border border-gray-200 shadow-md bg-white-low rounded-medium">
            <h2 className="mb-6 text-2xl font-bold">Chi tiết công việc</h2>
            <div className="space-y-4">
              {/* Tên công việc */}
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Tên công việc
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full bg-white-bright focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Tên công việc"
                />
              </div>

              {/* Địa điểm */}
              <label className="block mb-1 text-sm font-bold">
                Địa điểm làm việc
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <select
                  value={form.location.province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-full bg-white-bright focus:outline-none focus:ring-2 focus:ring-blue"
                >
                  <option value="">Chọn tỉnh</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <select
                  value={form.location.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={!districts.length}
                  className="w-full px-4 py-2 rounded-full bg-white-bright focus:outline-none focus:ring-2 focus:ring-blue"
                >
                  <option value="">Chọn quận/huyện</option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <select
                  value={form.location.ward}
                  onChange={(e) => handleWardChange(e.target.value)}
                  disabled={!wards.length}
                  className="w-full px-4 py-2 rounded-full bg-white-bright focus:outline-none focus:ring-2 focus:ring-blue"
                >
                  <option value="">Chọn phường/xã</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Số lượng */}
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Số lượng tuyển
                </label>
                <input
                  type="number"
                  name="hiringCount"
                  value={form.hiringCount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full bg-white-bright focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Số lượng"
                />
              </div>

              {/* Hình thức & Lương */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-bold">
                    Hình thức làm việc
                  </label>
                  <select
                    name="workType"
                    value={form.workType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-full bg-white-bright focus:outline-none focus:ring-2 focus:ring-blue"
                  >
                    <option value="">-- Chọn -- </option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-bold text-gray-700">
                    Tiền thuê
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-full bg-white-bright focus:outline-none focus:ring-2 focus:ring-blue"
                    placeholder="Lương"
                  />
                </div>
              </div>

              {/* Kinh nghiệm */}
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Kinh nghiệm yêu cầu
                </label>
                <input
                  type="number"
                  name="expRequired"
                  value={form.expRequired}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full bg-white-bright focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="VD: 1 năm"
                />
              </div>

              {/* Thời gian làm việc */}
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Thời gian làm việc
                </label>
                <input
                  type="text"
                  name="workingTime"
                  value={form.workingTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full bg-white-bright focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Part-time, 20h/tuần"
                />
              </div>

              {/* Mô tả công việc */}
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Mô tả công việc
                </label>
                <Editor
                  tinymceScriptSrc="/tinymce/js/tinymce/tinymce.min.js"
                  apiKey="no-api-key"
                  name="description"
                  value={form.description}
                  onEditorChange={(newValue) =>
                    setForm({ ...form, description: newValue })
                  }
                  init={{
                    selector: 'textarea',
                    height: 300,
                    statusbar: false,
                    menubar: false,
                    license_key: 'gpl',
                    plugins: ['link', 'table', 'lists', 'code'],
                    toolbar:
                      'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist'
                  }}
                />
              </div>

              {/* Nội dung công việc */}
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Nội dung công việc
                </label>
                <Editor
                  tinymceScriptSrc="/tinymce/js/tinymce/tinymce.min.js"
                  apiKey="no-api-key"
                  name="content"
                  value={form.content}
                  onEditorChange={(newValue) =>
                    setForm({ ...form, content: newValue })
                  }
                  init={{
                    selector: 'textarea',
                    height: 300,
                    statusbar: false,
                    menubar: false,
                    license_key: 'gpl',
                    plugins: ['link', 'table', 'lists', 'code'],
                    toolbar:
                      'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist'
                  }}
                />
              </div>

              {/* Hạn nộp hồ sơ */}
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Hạn nộp hồ sơ
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline ? new Date(form.deadline).toISOString().slice(0, 10) : ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full bg-white-bright focus:outline-none focus:ring-2 focus:ring-blue"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold">
                  Ngành
                </label>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  options={majors.map((m) => ({ value: m._id, label: m.name }))}
                  value={form.major
                    .map((id) => {
                      const m = majors.find((m) => m._id === id)
                      return m ? { value: m._id, label: m.name } : null
                    })
                    .filter(Boolean)}
                  onChange={(selected) =>
                    setForm({ ...form, major: selected.map((s) => s.value) })
                  }
                  className="text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold">
                  Chuyên ngành
                </label>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  options={specs
                    .filter((s) => form.major.includes(s.major))
                    .map((s) => ({ value: s._id, label: s.name }))}
                  value={form.specialization
                    .map((id) => {
                      const spec = specs.find((s) => s._id === id)
                      return spec
                        ? { value: spec._id, label: spec.name }
                        : null
                    })
                    .filter(Boolean)}
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      specialization: selected.map((s) => s.value)
                    })
                  }
                  className="text-sm"
                />
              </div>

              {/* Nút submit */}
              <button
                type="submit"
                className="px-6 py-2 text-white transition rounded-full cursor-pointer bg-blue hover:bg-blue-700"
              >
                {id ? 'Cập nhật bài đăng' : 'Tạo bài đăng'}
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  )
}

export default JobEditor
