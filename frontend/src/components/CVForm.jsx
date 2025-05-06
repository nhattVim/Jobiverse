import { useState, React } from 'react'

const personalFields = {
  avatar: { label: 'Ảnh đại diện', placeholder: 'Dán link ảnh đại diện...', type: 'url' },
  name: { label: 'Họ và tên', placeholder: 'Nhập họ tên', type: 'text' },
  birthday: { label: 'Ngày sinh', placeholder: 'DD/MM/YYYY', type: 'date' },
  gender: {
    label: 'Giới tính',
    type: 'select',
    options: ['Nam', 'Nữ'],
    placeholder: '-- Chọn giới tính --'
  },
  phone: { label: 'Số điện thoại', placeholder: '0123456789', type: 'tel' },
  email: { label: 'Email', placeholder: 'example@gmail.com', type: 'email' },
  address: { label: 'Địa chỉ', placeholder: 'Tp Quy Nhơn, Bình Định', type: 'text' },
  website: { label: 'Website', placeholder: 'facebook.com/Jobiverse.vn', type: 'url' },
  sumary: { label: 'Giới thiệu ngắn', placeholder: 'Sơ lược bản thân', type: 'text' },
  desiredPosition: { label: 'Vị trí mong muốn', placeholder: 'Nhập vị trí mong muốn', type: 'text' }
}

export default function CVForm({ cvData, setCvData }) {
  console.log(cvData)
  const [newSkill, setNewSkill] = useState('')

  const handleChange = (e) => {
    setCvData({ ...cvData, [e.target.name]: e.target.value })
  }

  const handleExpChange = (e, idx) => {
    const updated = [...cvData.experiences]
    updated[idx][e.target.name] = e.target.value
    setCvData({ ...cvData, experiences: updated })
  }

  const addExperience = () => {
    setCvData({
      ...cvData,
      experiences: [...cvData.experiences, { position: '', company: '', start: '', end: '', description: '' }]
    })
  }

  const handleEduChange = (e, idx) => {
    const updated = [...cvData.educations]
    updated[idx][e.target.name] = e.target.value
    setCvData({ ...cvData, educations: updated })
  }

  const addEducation = () => {
    setCvData({
      ...cvData,
      educations: [...cvData.educations, { degree: '', school: '', start: '', end: '' }]
    })
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setCvData({ ...cvData, skills: [...cvData.skills, newSkill.trim()] })
      setNewSkill('')
    }
  }

  const removeSkill = (idx) => {
    const updated = [...cvData.skills]
    updated.splice(idx, 1)
    setCvData({ ...cvData, skills: updated })
  }

  const removeExperience = (idx) => {
    const updated = [...cvData.experiences]
    updated.splice(idx, 1)
    setCvData({ ...cvData, experiences: updated })
  }

  const removeEducation = (idx) => {
    const updated = [...cvData.educations]
    updated.splice(idx, 1)
    setCvData({ ...cvData, educations: updated })
  }

  return (
    <form className="flex flex-col w-full max-w-xl gap-4 p-6 shadow bg-white-bright rounded-xl">
      <h2 className="mb-2 text-2xl font-bold">Tạo hồ sơ CV</h2>

      {Object.entries(personalFields).map(([key, field]) => (
        <div key={key}>
          <label className="block font-medium">{field.label}</label>

          {field.type === 'select' ? (
            <select name={key} value={cvData[key]} onChange={handleChange} className="w-full p-2 mt-1 border rounded">
              <option value="">{field.placeholder}</option>
              {field.options.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || 'text'}
              name={key}
              placeholder={field.placeholder}
              value={cvData[key]}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded"
            />
          )}
        </div>
      ))}

      {/* Kinh nghiệm làm việc */}
      <div>
        <label className="block font-medium">Kinh nghiệm làm việc</label>
        {cvData.experiences.map((exp, i) => (
          <div key={i} className="relative p-2 my-2 border rounded">
            <button type="button" className="absolute text-sm font-bold text-red-500 -right-4 top-1"
              onClick={() => removeExperience(i)}
            >×</button>
            <input type="text" name="position" placeholder="Vị trí" className="w-full p-1 mb-1 border rounded"
              value={exp.position} onChange={(e) => handleExpChange(e, i)} />
            <input type="text" name="company" placeholder="Công ty" className="w-full p-1 mb-1 border rounded"
              value={exp.company} onChange={(e) => handleExpChange(e, i)} />
            <input type="text" name="start" placeholder="Bắt đầu (VD: 01/2020)" className="w-full p-1 mb-1 border rounded"
              value={exp.start} onChange={(e) => handleExpChange(e, i)} />
            <input type="text" name="end" placeholder="Kết thúc (VD: 12/2022)" className="w-full p-1 mb-1 border rounded"
              value={exp.end} onChange={(e) => handleExpChange(e, i)} />
            <textarea name="description" placeholder="Mô tả công việc" className="w-full p-1 border rounded"
              value={exp.description} onChange={(e) => handleExpChange(e, i)} />
          </div>
        ))}
        <button type="button" className="text-sm text-blue-600 underline" onClick={addExperience}>
          + Thêm kinh nghiệm
        </button>
      </div>

      {/* Học vấn */}
      <div>
        <label className="block font-medium">Học vấn</label>
        {cvData.educations.map((edu, idx) => (
          <div key={idx} className="relative p-2 my-2 border rounded">
            <button type="button" className="absolute text-sm font-bold text-red-500 top-1 -right-4 hover:text-red-700"
              onClick={() => removeEducation(idx)}>×</button>
            <input type="text" name="degree" placeholder="Bằng cấp" className="w-full p-1 mb-1 border rounded"
              value={edu.degree} onChange={(e) => handleEduChange(e, idx)} />
            <input type="text" name="school" placeholder="Trường học" className="w-full p-1 mb-1 border rounded"
              value={edu.school} onChange={(e) => handleEduChange(e, idx)} />
            <input type="text" name="start" placeholder="Bắt đầu (VD: 2016)" className="w-full p-1 mb-1 border rounded"
              value={edu.start} onChange={(e) => handleEduChange(e, idx)} />
            <input type="text" name="end" placeholder="Kết thúc (VD: 2020)" className="w-full p-1 border rounded"
              value={edu.end} onChange={(e) => handleEduChange(e, idx)} />
          </div>
        ))}
        <button type="button" className="text-sm text-blue-600 underline" onClick={addEducation}>
          + Thêm học vấn
        </button>
      </div>

      {/* Kỹ năng */}
      <div>
        <label className="block font-medium">Kỹ năng</label>
        <div className="flex gap-2 mt-1 mb-2">
          <input type="text" className="flex-grow p-1 border rounded" placeholder="Nhập kỹ năng"
            value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
          <button type="button" className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700" onClick={addSkill}>
            Thêm
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map((skill, idx) => (
            <span key={idx} className="px-2 py-1 text-sm bg-gray-200 rounded">
              {skill}
              <button type="button" className="ml-1 font-bold text-red-500 hover:text-red-700"
                onClick={() => removeSkill(idx)}>×</button>
            </span>
          ))}
        </div>
      </div>
    </form>
  )
}
