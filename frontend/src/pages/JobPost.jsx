import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiFetch from '../services/api'
import BannerText from '../components/BannerText'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const animatedComponents = makeAnimated()

const JobPost = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [majors, setMajors] = useState([])
  const [specs, setSpecs] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    major: [],
    spec: [],
    content: '',
    workingTime: '',
    applicants: [null],
    assignedStudents: [null],
    salary: 0,
    experiences: '',
    deadline: '',
    hiringCount: 0,
    workType: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
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
      await apiFetch('/projects/my', 'POST', form)
      navigate('/job-list')
    } catch (err) {
      console.error(err)
      setError('Tạo bài đăng thất bại, vui lòng thử lại.')
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
      setMajors(majorData)
      setSpecs(specData)
    }
    fetchData()
  }, [])

  console.log('Form data:', form)

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <BannerText title="Đăng một công việc" caption="Đưa công việc của bạn đến gần hơn với những người phù hợp. Một tin đăng chuẩn chỉnh sẽ giúp bạn tiết kiệm thời gian và nhanh chóng tiếp cận nhân sự chất lượng." />

      <div className="w-full max-w-4xl py-20 mx-auto space-y-6">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit}>
          <section className="p-10 border border-gray-200 shadow-md bg-white-low rounded-medium">
            <h2 className="mb-6 text-2xl font-bold">Chi tiết công việc</h2>
            <div className="space-y-4">

              {/* Tên công việc */}
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">Tên công việc</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Tên công việc"
                />
              </div>

              {/* Địa điểm */}
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">Địa điểm làm việc</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Địa điểm"
                />
              </div>

              {/* Số lượng */}
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">Số lượng tuyển</label>
                <input
                  type="number"
                  name="hiringCount"
                  value={form.hiringCount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Số lượng"
                />
              </div>

              {/* Hình thức & Lương */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-bold text-gray-700">Hình thức làm việc</label>
                  <select
                    name="workType"
                    value={form.workType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn -- </option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-bold text-gray-700">Tiền thuê</label>
                  <input
                    type="number"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Lương"
                  />
                </div>
              </div>

              {/* Kinh nghiệm */}
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">Kinh nghiệm yêu cầu</label>
                <input
                  type="text"
                  name="experiences"
                  value={form.experiences}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: 1 năm"
                />
              </div>

              {/* Thời gian làm việc */}
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">Thời gian làm việc</label>
                <input
                  type="text"
                  name="workingTime"
                  value={form.workingTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Part-time, 20h/tuần"
                />
              </div>

              {/* Mô tả công việc */}
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">Giới thiệu</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả"
                />
              </div>

              {/* Nội dung công việc */}
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">Mô tả công việc</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả"
                />
              </div>

              {/* Hạn nộp hồ sơ */}
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">Hạn nộp hồ sơ</label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">Ngành</label>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  options={majors.map((m) => ({ value: m._id, label: m.name }))}
                  value={form.major.map((id) => {
                    const m = majors.find((m) => m._id === id)
                    return m ? { value: m._id, label: m.name } : null
                  }).filter(Boolean)}
                  onChange={(selected) =>
                    setForm({ ...form, major: selected.map((s) => s.value) })
                  }
                  className="text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">Chuyên ngành</label>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  options={specs
                    .filter((s) => form.major.includes(s.major))
                    .map((s) => ({ value: s._id, label: s.name }))
                  }
                  value={form.spec.map((id) => {
                    const spec = specs.find((s) => s._id === id)
                    return spec ? { value: spec._id, label: spec.name } : null
                  }).filter(Boolean)}
                  onChange={(selected) =>
                    setForm({ ...form, spec: selected.map((s) => s.value) })
                  }
                  className="text-sm"
                />
              </div>

              {/* Nút submit */}
              <button
                type="submit"
                className="px-6 py-2 text-white transition rounded-full bg-blue hover:bg-blue-700"
              >
                Tạo bài đăng
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  )
}

export default JobPost
