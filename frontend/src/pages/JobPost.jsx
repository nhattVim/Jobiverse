import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiFetch from '../services/api'

const JobPost = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    location: '',
    quantity: '',
    jobType: '',
    salary: '',
    experience: '',
    gpa: '',
    description: '',
    requirement: '',
    workTime: '',
    deadline: ''
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const requiredFields = ['title', 'location', 'jobType', 'salary', 'description']
    for (const field of requiredFields) {
      if (!form[field]) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc.')
        return
      }
    }

    try {
      await apiFetch('/jobpost', 'POST', form)
      navigate('/job-list')
    } catch (err) {
      console.error(err)
      setError('Tạo bài đăng thất bại, vui lòng thử lại.')
    }
  }

  return (
    <div className="min-h-screen bg-white">

      <div className="w-full bg-gradient-blue-right text-white p-6 rounded-r-2xl">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Đăng một công việc</h1>
          <p className="text-sm">
            Đưa công việc của bạn đến gần hơn với những người phù hợp. Một tin đăng chuẩn chỉnh sẽ giúp bạn tiết kiệm thời gian và nhanh chóng tiếp cận nhân sự chất lượng.
          </p>
        </div>
      </div>


      <div className="max-w-2xl w-full mx-auto mt-6 space-y-6">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit}>
          <section className="bg-white-low p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-bold mb-6">Chi tiết công việc</h2>
            <div className="space-y-4">

              {/* Tên công việc */}
              <div>
                <label className="font-bold block text-gray-700 text-sm mb-1">Tên công việc</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Tên công việc"
                />
              </div>

              {/* Địa điểm */}
              <div>
                <label className="font-bold block text-gray-700 text-sm mb-1">Địa điểm làm việc</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Địa điểm"
                />
              </div>

              {/* Số lượng */}
              <div>
                <label className="font-bold block text-gray-700 text-sm mb-1">Số lượng tuyển</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Số lượng"
                />
              </div>

              {/* Hình thức & Lương */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block text-gray-700 text-sm mb-1">Hình thức làm việc</label>
                  <select
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn...</option>
                    <option value="Thời vụ">Thời vụ</option>
                    <option value="Toàn thời gian">Toàn thời gian</option>
                    <option value="Bán thời gian">Bán thời gian</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block text-gray-700 text-sm mb-1">Tiền thuê</label>
                  <input
                    type="number"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Lương"
                  />
                </div>
              </div>

              {/* Kinh nghiệm & GPA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block text-gray-700 text-sm mb-1">Kinh nghiệm yêu cầu</label>
                  <input
                    type="text"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 1 năm"
                  />
                </div>

                <div>
                  <label className="font-bold block text-gray-700 text-sm mb-1">GPA tối thiểu</label>
                  <input
                    type="number"
                    name="gpa"
                    value={form.gpa}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="GPA"
                  />
                </div>
              </div>

              {/* Mô tả công việc */}
              <div>
                <label className="font-bold block text-gray-700 text-sm mb-1">Mô tả công việc</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả"
                />
              </div>

              {/* Yêu cầu */}
              <div>
                <label className="font-bold block text-gray-700 text-sm mb-1">Yêu cầu ứng viên</label>
                <textarea
                  name="requirement"
                  value={form.requirement}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Yêu cầu"
                />
              </div>

              {/* Thời gian làm việc */}
              <div>
                <label className="font-bold block text-gray-700 text-sm mb-1">Thời gian làm việc</label>
                <input
                  type="text"
                  name="workTime"
                  value={form.workTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: 8h-17h"
                />
              </div>

              {/* Hạn nộp hồ sơ */}
              <div>
                <label className="font-bold block text-gray-700 text-sm mb-1">Hạn nộp hồ sơ</label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Nút submit */}
              <button
                type="submit"
                className="bg-blue text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
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
