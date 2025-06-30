import CVPreviewSection from './CVPreviewSection'
import { formatDate } from '../utils/dateUtils'
import { UserCircleIcon } from '@heroicons/react/24/outline'

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
      { name: 'end', placeholder: 'Kết thúc' }
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
          <img src={cvData.avatar} alt="avatar" className="object-cover w-full border border-[#cccccc] shadow aspect-square" />
        ) : (
          <div className="flex items-center justify-center w-full bg-gray-200 border border-gray aspect-square">
            <UserCircleIcon className="w-16 h-16" />
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
