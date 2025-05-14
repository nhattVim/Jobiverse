import usePatchOklchColors from '../hooks/usePatchOklchColors'

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
      { name: 'name', placeholder: 'Tên tổ chức' },
      { name: 'degree', placeholder: 'Ngành học / Môn học' },
      { name: 'description', placeholder: 'Mô tả hoạt động' },
      { name: 'start', placeholder: 'Bắt đầu' },
      { name: 'end', placeholder: 'Kết thúc' }
    ]
  },
  achievements: {
    title: 'Thành tích',
    fields: [
      { name: 'title', placeholder: 'Tên thành tích' },
      { name: 'description', placeholder: 'Tên thành tích' }
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
  usePatchOklchColors(`#${id}`)

  return (
    <div className="w-full bg-white-bright  border border-[#cccccc] p-6 text-[#1c1c1c] grid grid-cols-3 gap-2 font-sans" id={id}>
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
                <p className="pb-4 text-sm italic break-words">{cvData[key]}</p>
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
            <div key={key} className="p-3 mb-4 bg-gray-200 rounded-sm shadow">
              <div className="flex items-center mb-1">
                <h3 className="overflow-hidden font-bold uppercase truncate whitespace-nowrap">{section.title}</h3>
                <span className="flex-grow ml-2 border-t border-gray-400"></span>
              </div>

              {cvData[key].map((item, i) => {
                const hasStartEnd = section.fields.some(f => f.name === 'start') && section.fields.some(f => f.name === 'end')
                const firstField = section.fields[0]?.name || 'Tên'

                return (
                  <div key={i} className="mb-2">
                    {hasStartEnd ? (
                      <>
                        <div className="flex justify-between py-2 text-sm italic text-gray-600">
                          <span className="w-1/2 overflow-hidden truncate">
                            {item[firstField] || section.fields[0]?.placeholder}
                          </span>
                          <span className="flex gap-3">
                            <span>{item.start || 'Bắt đầu'}</span>
                            <span>-</span>
                            <span>{item.end || 'Kết thúc'}</span>
                          </span>
                        </div>

                        {section.fields
                          .filter(f => !['start', 'end', firstField].includes(f.name))
                          .map((f, j) => (
                            <p key={j} className="w-full py-2 text-sm italic text-gray-600 break-words">{item[f.name] || f.placeholder}</p>
                          ))}
                      </>
                    ) : (
                      section.fields.map((f, j) => (
                        <p key={j} className="py-2 text-sm italic text-gray-600">{item[f.name] || f.placeholder}</p>
                      ))
                    )}

                    {cvData[key].length > 1 && i < cvData[key].length - 1 && (
                      <hr className="my-2 border-t border-dashed" />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
