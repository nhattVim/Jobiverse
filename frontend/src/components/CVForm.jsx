import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CVFormSection from './CVFormSection'
import { formatDate } from '../utils/dateUtils'

const personalFields = {
  avatar: { label: 'Ảnh đại diện', placeholder: 'Dán link ảnh đại diện...', type: 'url' },
  name: { label: 'Họ và tên', placeholder: 'Nhập họ tên', type: 'text' },
  birthday: { label: 'Ngày sinh', placeholder: 'DD/MM/YYYY', type: 'date' },
  gender: { label: 'Giới tính', type: 'select', options: ['Nam', 'Nữ'], placeholder: '-- Chọn giới tính --' },
  phone: { label: 'Số điện thoại', placeholder: '0123456789', type: 'tel' },
  email: { label: 'Email', placeholder: 'example@gmail.com', type: 'email' },
  address: { label: 'Địa chỉ', placeholder: 'Tp Quy Nhơn, Bình Định', type: 'text' },
  website: { label: 'Website', placeholder: 'facebook.com/Jobiverse.vn', type: 'url' },
  summary: { label: 'Giới thiệu ngắn', placeholder: 'Sơ lược bản thân', type: 'text' },
  desiredPosition: { label: 'Vị trí mong muốn', placeholder: 'Nhập vị trí mong muốn', type: 'text' }
}

const experienceFields = [
  { name: 'position', placeholder: 'Vị trí' },
  { name: 'company', placeholder: 'Công ty' },
  { name: 'start', placeholder: 'Bắt đầu (VD: 01/2020)', type: 'date' },
  { name: 'end', placeholder: 'Kết thúc (VD: 12/2022)', type: 'date' },
  { name: 'description', placeholder: 'Mô tả công việc', textarea: true }
]

const educationFields = [
  { name: 'degree', placeholder: 'Bằng cấp' },
  { name: 'school', placeholder: 'Trường học' },
  { name: 'start', placeholder: 'Bắt đầu (VD: 2016)', type: 'date' },
  { name: 'end', placeholder: 'Kết thúc (VD: 2020)', type: 'date' }
]

const activityFields = [
  { name: 'title', placeholder: 'Tên hoạt động' },
  { name: 'organization', placeholder: 'Tổ chức' },
  { name: 'start', placeholder: 'Bắt đầu (VD: 01/2021)', type: 'date' },
  { name: 'end', placeholder: 'Kết thúc (VD: 06/2022)', type: 'date' },
  { name: 'description', placeholder: 'Mô tả', textarea: true }
]

const achievementFields = [
  { name: 'title', placeholder: 'Tên thành tích' },
  { name: 'description', placeholder: 'Mô tả', textarea: true }
]

const languageFields = [
  { name: 'language', placeholder: 'Ngôn ngữ (VD: Tiếng Anh)' },
  { name: 'level', placeholder: 'Trình độ (VD: Trung cấp)' }
]

const socialFields = [
  { name: 'platform', placeholder: 'Mạng xã hội (VD: Facebook)' },
  { name: 'link', placeholder: 'Link' }
]

export default function CVForm({ cvData, setCvData, onSubmit }) {
  const { id } = useParams()
  const [skill, setSkill] = useState('')
  const [mess, setMess] = useState('Tạo mới')
  const [focusedField, setFocusedField] = useState(null)

  useEffect(() => {
    if (id) return setMess('Cập nhật')
  }, [id])

  const handleChange = (e) => {
    setCvData({ ...cvData, [e.target.name]: e.target.value })
  }

  const handleListChange = (e, idx, key) => {
    const updated = [...cvData[key]]
    updated[idx][e.target.name] = e.target.value
    setCvData({ ...cvData, [key]: updated })
  }

  const addItem = (key, emptyItem) => {
    setCvData({ ...cvData, [key]: [...cvData[key], { ...emptyItem }] })
  }

  const removeItem = (idx, key) => {
    const updated = [...cvData[key]]
    updated.splice(idx, 1)
    setCvData({ ...cvData, [key]: updated })
  }

  return (
    <form style={{ scrollbarGutter: 'stable' }} className="flex flex-col w-full max-h-screen gap-4 px-10 pb-10 overflow-y-hidden border shadow hover:overflow-y-auto bg-white-bright border-gray-light scrollbar-custom">
      <div className="sticky top-0 z-50 w-full pt-10 pb-2 border-b bg-white-bright border-gray-light">
        <input
          type="text" className="mb-2 text-2xl font-bold focus:outline-none focus:ring-0 focus:border-none"
          placeholder={cvData.title || 'Tên hồ sơ (VD: Fullstack CV)'}
          value={cvData.title}
          onChange={(e) => setCvData({ ...cvData, title: e.target.value })}
        />
      </div>

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
              type={field.type === 'date' && focusedField !== key ? 'text' : field.type}
              name={key}
              placeholder={field.placeholder}
              value={
                field.type === 'date'
                  ? (cvData[key]
                    ? (focusedField === key
                      ? new Date(cvData[key]).toISOString().slice(0, 10)
                      : formatDate(cvData[key]))
                    : ''
                  ) : (cvData[key] || '')
              }
              onChange={handleChange}
              onFocus={() => field.type === 'date' && setFocusedField(key)}
              onBlur={() => setFocusedField(null)}
              className="w-full p-2 mt-1 border rounded"
            />
          )}
        </div>
      ))}

      <CVFormSection
        sectionKey="Kinh nghiệm làm việc"
        fields={experienceFields}
        items={cvData.experiences}
        onChange={(e, idx) => handleListChange(e, idx, 'experiences')}
        onAdd={() => addItem('experiences', { position: '', company: '', start: '', end: '', description: '' })}
        onRemove={(idx) => removeItem(idx, 'experiences')}
        focusedField={focusedField}
        setFocusedField={setFocusedField}
      />

      <CVFormSection
        sectionKey="Hoạt động"
        fields={activityFields}
        items={cvData.activities}
        onChange={(e, idx) => handleListChange(e, idx, 'activities')}
        onAdd={() => addItem('activities', { title: '', organization: '', start: '', end: '', description: '' })}
        onRemove={(idx) => removeItem(idx, 'activities')}
        focusedField={focusedField}
        setFocusedField={setFocusedField}
      />

      <CVFormSection
        sectionKey="Thành tích"
        fields={achievementFields}
        items={cvData.achievements}
        onChange={(e, idx) => handleListChange(e, idx, 'achievements')}
        onAdd={() => addItem('achievements', { title: '', description: '' })}
        onRemove={(idx) => removeItem(idx, 'achievements')}
      />

      <CVFormSection
        sectionKey="Ngôn ngữ"
        fields={languageFields}
        items={cvData.languages}
        onChange={(e, idx) => handleListChange(e, idx, 'languages')}
        onAdd={() => addItem('languages', { language: '', level: '' })}
        onRemove={(idx) => removeItem(idx, 'languages')}
      />

      <CVFormSection
        sectionKey="Học vấn"
        fields={educationFields}
        items={cvData.educations}
        onChange={(e, idx) => handleListChange(e, idx, 'educations')}
        onAdd={() => addItem('educations', { degree: '', school: '', start: '', end: '' })}
        onRemove={(idx) => removeItem(idx, 'educations')}
        focusedField={focusedField}
        setFocusedField={setFocusedField}
      />

      <CVFormSection
        sectionKey="mạng xã hội"
        fields={socialFields}
        items={cvData.socials}
        onChange={(e, idx) => handleListChange(e, idx, 'socials')}
        onAdd={() => addItem('socials', { platform: '', link: '' })}
        onRemove={(idx) => removeItem(idx, 'socials')}
      />

      <div>
        <label className="block font-medium">Kỹ năng</label>
        <div className="flex gap-2 mt-1 mb-2">
          <input type="text" className="flex-grow p-1 border rounded" placeholder="Nhập kỹ năng"
            value={skill} onChange={(e) => setSkill(e.target.value)} />
          <button type="button" className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700" onClick={() => {
            if (skill.trim()) {
              setCvData({ ...cvData, skills: [...cvData.skills, skill.trim()] })
              setSkill('')
            }
          }}>
            Thêm
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map((skill, idx) => (
            <span key={idx} className="px-2 py-1 text-sm bg-gray-200 rounded">
              {skill}
              <button type="button" className="ml-1 font-bold text-red-500 hover:text-red-700"
                onClick={() => {
                  const updated = [...cvData.skills]
                  updated.splice(idx, 1)
                  setCvData({ ...cvData, skills: updated })
                }}>×</button>
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSubmit(cvData)}
        className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        {mess} CV
      </button>
    </form>
  )
}
