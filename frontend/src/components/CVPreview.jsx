import CVPreviewSection from './CVPreviewSection'
import { formatDate } from '../utils/dateUtils'

const personalFields = {
  birthday: { label: 'Ngày sinh', placeholder: 'DD/MM/YYYY' },
  gender: { label: 'Giới tính', placeholder: 'Nam/Nữ' },
  phone: { label: 'Số điện thoại', placeholder: '0123456789' },
  email: { label: 'Email', placeholder: 'example@gmail.com' },
  address: { label: 'Địa chỉ', placeholder: 'Tp Quy Nhơn, Bình Định' },
  website: { label: 'Website', placeholder: 'facebook.com/Jobiverse.vn' }
}

const sectionFields = {
  experiences: {
    title: 'Kinh nghiệm làm việc',
    fields: [
      { name: 'company', placeholder: 'Tên công ty' },
      { name: 'position', placeholder: 'Vị trí công việc' },
      { name: 'start', placeholder: 'Bắt đầu' },
      { name: 'end', placeholder: 'Kết thúc' },
      { name: 'description', placeholder: 'Mô tả kinh nghiệm làm việc của bạn' }
    ]
  },
  educations: {
    title: 'Học vấn',
    fields: [
      { name: 'school', placeholder: 'Tên trường học' },
      { name: 'degree', placeholder: 'Ngành học / Môn học' },
      { name: 'start', placeholder: 'Bắt đầu' },
      { name: 'end', placeholder: 'Kết thúc' },
      { name: 'description', placeholder: 'Mô tả quá trình học tập hoặc thành tích của bạn' }
    ]
  },
  activities: {
    title: 'Hoạt động',
    fields: [
      { name: 'title', placeholder: 'Tên hoạt động' },
      { name: 'organization', placeholder: 'Tổ chức' },
      { name: 'description', placeholder: 'Mô tả hoạt động' },
      { name: 'start', placeholder: 'Bắt đầu' },
      { name: 'end', placeholder: 'Kết thúc' }
    ]
  },
  achievements: {
    title: 'Thành tích',
    fields: [
      { name: 'title', placeholder: 'Tên thành tích' },
      { name: 'description', placeholder: 'Mô tả thành tích' }
    ]
  },
  languages: {
    title: 'Ngôn ngữ',
    fields: [
      { name: 'language', placeholder: 'Ngôn ngữ' },
      { name: 'level', placeholder: 'Trình độ' }
    ]
  },
  socials: {
    title: 'Mạng xã hội',
    fields: [
      { name: 'platform', placeholder: 'Tên mạng xã hội' },
      { name: 'link', placeholder: 'Link' }
    ]
  }
}

export default function CVPreview({ cvData, id }) {
  return (
    <div className="w-full bg-white-bright border border-[#cccccc] p-6 text-[#1c1c1c] grid grid-cols-3 gap-2 font-sans" id={id}>
      <div className="col-span-1 space-y-2">
        <h1 className="text-3xl font-bold font-['Noto_Sans'] leading-9 mt-2">{cvData.name || 'Họ tên ứng viên'}</h1>

        {cvData.avatar ? (
          <img src={cvData.avatar} alt="avatar" className="object-cover w-full border shadow aspect-square" />
        ) : (
          <div className="flex items-center justify-center w-full bg-gray-200 border aspect-square">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}

        <div className="p-3 text-white bg-gray-700 shadow">
          {Object.entries(personalFields).map(([key, { label, placeholder }]) => (
            <div key={key}>
              <p className="py-2 font-medium">{label}</p>
              {cvData[key] ? (
                <p className="pb-4 text-sm italic break-words">
                  {key === 'birthday' ? formatDate(cvData[key]) : cvData[key]}
                </p>
              ) : (
                <p className="pb-4 text-sm italic text-[#cccc]">{placeholder}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2">
        <div className="flex justify-end w-full h-10 px-4 text-white bg-gray-700">
          <p className="w-1/2 py-1 overflow-hidden italic text-right truncate whitespace-nowrap">
            {cvData.desiredPosition || 'Vị trí ứng tuyển'}
          </p>
        </div>

        <div className="mt-4">
          {Object.entries(sectionFields).map(([key, section]) => (
            <CVPreviewSection key={key} section={section} data={cvData[key]} />
          ))}
        </div>
      </div>
    </div>
  )
}
