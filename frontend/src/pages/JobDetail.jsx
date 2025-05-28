import {
  MapPinIcon,
  CurrencyDollarIcon,
  AcademicCapIcon, // Sử dụng cho Kinh nghiệm (placeholder, hoặc tùy chỉnh)
  BriefcaseIcon, // Sử dụng cho Kinh nghiệm (thay thế AcademicCapIcon nếu hợp lý hơn)
  CalendarDaysIcon, // Hạn nộp hồ sơ
  HeartIcon, // Nút yêu thích
  ArrowRightIcon, // Mũi tên cho nút ứng tuyển
  UsersIcon, // Quy mô
  TagIcon, // Lĩnh vực
  BuildingOfficeIcon, // Địa điểm công ty
  BookOpenIcon, // Học vấn
  Bars3CenterLeftIcon, // GPA (placeholder)
  UserGroupIcon, // Số lượng tuyển
  ClockIcon // Hình thức làm việc
} from '@heroicons/react/24/solid'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import Banner from '../components/Banner'

const JobDetail = () => {
  // Dữ liệu mẫu cho công việc cụ thể (trong thực tế sẽ nhận từ API hoặc props)
  const jobData = {
    jobTitle: 'Backend Developer (C#, .NET)',
    salary: 'Từ 2 - 4 triệu',
    location: 'Hồ Chí Minh',
    experience: 'Không yêu cầu',
    deadline: '30/05/2025',
    description: [
      'Reading and understanding project specifications, analyzing requirements.',
      'Implementing & testing software components.',
      'Troubleshooting technical issues.',
      'Working with tester to ensure deliveries to meet expected quality.',
      'Studying new innovative technologies to solve technical challenges.'
    ],
    requirements: [
      'Bachelor degree in Computer Science or Software Engineering.',
      'Experience 1+ years in .NET framework or .NET Core framework in Web Application Development',
      'Good at English.',
      'Self Management.',
      'Programming Languages: C Sharp (.NET or .NET Core), Javascript, HTML, CSS',
      'Deep Understanding in Object Oriented Programming.',
      'Eager to learn new technologies.'
    ],
    benefits: [
      'Friendly and comfortable working environment',
      'Opportunity to work directly with foreign customers.',
      'Opportunity to learn new technologies',
      'Team building & company trips at least once a year',
      'Premium healthcare insurance & Full-labor insurance (social, health, unemployed insurances)',
      'Bonuses at National holidays as well as 13th & 14th month bonuses',
      '15 days paid leave per year',
      'Working Hours: 9:00 AM – 6:30 PM from Monday to Friday.',
      'Competitive salary'
    ],
    workplaceLocation: 'Hồ Chí Minh: 57 Quốc Lộ 13, Bình Thạnh',
    workSchedule: 'Thứ 2 - Thứ 6 (từ 09:00 đến 18:30)',
    company: {
      name: 'CodeLink',
      logo: 'https://cdn.prod.website-files.com/66b757e42412d2f5e0906c5f/66bf2b9a2ff5d8f19427f6db_job-07.svg',
      size: '10 thành viên',
      industry: 'IT-Phần mềm',
      address: 'Thư viện Đại học Quy Nhơn'
    },
    generalInfo: {
      education: 'Đại học trở lên',
      gpa: '6.0 trở lên',
      hiringCount: '3 người',
      workType: 'Toàn thời gian'
    }
  }

  return (
    <>
      <Banner />
      <div className="w-full py-30">
        <main className="container-responsive">
          <div className="grid grid-cols-[1fr_0.5fr] gap-[70px] min-h-full ">
            <div className="w-full overflow-visible ">
              <div className="sticky top-[130px]">
                <div className="flex flex-col gap-5 p-10 rounded-medium bg-white-mid">
                  <h2 className="mb-2 text-2xl font-bold text-gray-800">
                    {jobData.jobTitle}
                  </h2>
                  <div className="flex flex-wrap items-center mb-4 text-sm text-gray-600 gap-x-6 gap-y-2">
                    <div className="flex items-center space-x-1">
                      <CurrencyDollarIcon className="w-4 h-4 text-blue-500" />
                      <span>Mức lương:</span>
                      <span className="font-medium text-gray-800">
                        {jobData.salary}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="w-4 h-4 text-blue-500" />
                      <span>Địa điểm:</span>
                      <span className="font-medium text-gray-800">
                        {jobData.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BriefcaseIcon className="w-4 h-4 text-blue-500" />
                      <span>Kinh nghiệm:</span>
                      <span className="font-medium text-gray-800">
                        {jobData.experience}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      Hạn nộp hồ sơ: {jobData.deadline}
                    </div>
                    <div className="flex gap-4 ml-auto">
                      <ButtonArrowOne>Ứng tuyển</ButtonArrowOne>
                      <button className="flex items-center justify-center w-10 h-10 p-2 text-blue-500 transition duration-300 border border-blue-500 rounded-full hover:bg-yellow-500">
                        <HeartIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-5 p-10 mt-5 rounded-medium bg-white-mid">
                  <h3 className="mb-3 text-xl font-semibold text-gray-800">
                    Chi tiết tin tuyển dụng
                  </h3>
                  {jobData.description && (
                    <div className="mb-4">
                      <h4 className="mb-2 font-medium text-gray-700">
                        Mô tả công việc
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                        {jobData.description.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {jobData.requirements && (
                    <div className="mb-4">
                      <h4 className="mb-2 font-medium text-gray-700">
                        Yêu cầu ứng viên
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                        {jobData.requirements.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {jobData.benefits && (
                    <div className="mb-4">
                      <h4 className="mb-2 font-medium text-gray-700">
                        Quyền lợi
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                        {jobData.benefits.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {jobData.workplaceLocation && (
                    <div className="mb-4">
                      <h4 className="mb-2 font-medium text-gray-700">
                        Địa điểm làm việc
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                        <li>{jobData.workplaceLocation}</li>
                      </ul>
                    </div>
                  )}
                  {jobData.workSchedule && (
                    <div className="mb-4">
                      <h4 className="mb-2 font-medium text-gray-700">
                        Thời gian làm việc
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                        <li>{jobData.workSchedule}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cột phải: Thông tin công ty */}
            <div className="w-full overflow-visible">
              <div className="sticky top-[130px]">
                <div className="flex flex-col gap-5 p-10 rounded-medium bg-white-mid">
                  <div className="flex items-center mb-4">
                    <img
                      src={jobData.company.logo}
                      alt={`${jobData.company.name} Logo`}
                      className="w-16 h-16 mr-4 border border-gray-200 rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {jobData.company.name}
                      </h3>
                    </div>
                  </div>
                  <ul className="mb-4 space-y-2 text-sm text-gray-700">
                    <li className="flex items-center space-x-2">
                      <UsersIcon className="w-4 h-4 text-gray-500" />
                      <span>Quy mô: {jobData.company.size}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TagIcon className="w-4 h-4 text-gray-500" />
                      <span>Lĩnh vực: {jobData.company.industry}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                      <span>Địa điểm: {jobData.company.address}</span>
                    </li>
                  </ul>
                  <button className="w-full px-4 py-2 text-blue-700 transition duration-300 bg-blue-100 rounded-lg hover:bg-blue-200">
                    Xem chi tiết
                  </button>
                </div>

                <div className="flex flex-col gap-5 p-10 mt-5 rounded-medium bg-white-mid">
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">
                    Thông tin chung
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <BookOpenIcon className="w-4 h-4 text-blue-500" />
                        <span>Học vấn</span>
                      </span>
                      <span className="font-medium">
                        {jobData.generalInfo.education}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <Bars3CenterLeftIcon className="w-4 h-4 text-blue-500" />{' '}
                        {/* Icon placeholder cho GPA */}
                        <span>GPA</span>
                      </span>
                      <span className="font-medium">
                        {jobData.generalInfo.gpa}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <UserGroupIcon className="w-4 h-4 text-blue-500" />
                        <span>Số lượng tuyển</span>
                      </span>
                      <span className="font-medium">
                        {jobData.generalInfo.hiringCount}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-blue-500" />
                        <span>Hình thức làm việc</span>
                      </span>
                      <span className="font-medium">
                        {jobData.generalInfo.workType}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default JobDetail
