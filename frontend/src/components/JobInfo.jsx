/* eslint-disable indent */
import {
  MapPinIcon, CurrencyDollarIcon, BriefcaseIcon, CalendarDaysIcon,
  UsersIcon, TagIcon, Bars3CenterLeftIcon,
  UserGroupIcon, ClockIcon, HeartIcon as HeartSolidIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  BookOpenIcon
} from '@heroicons/react/24/solid'
import {
  CheckCircleIcon, ClockIcon as ClockIconOutline, EyeIcon, HeartIcon, InboxArrowDownIcon, XCircleIcon
} from '@heroicons/react/24/outline'
import { useContext, useState } from 'react'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import { Link } from 'react-router-dom'
import RcmJob from '../components/RcmJob'
import RcmStudent from '../components/RcmStudent'
import { UserContext } from '../contexts/UserContext'
import { formatDate } from '../utils/dateUtils'

const JobInfo = ({ project, isOwner, applicantStatus, setIsOpen, isFavorited, handleFavorite, id, toast, fetchFullProjectData }) => {
  const { user } = useContext(UserContext)

  const locationText = [project.location?.ward, project.location?.district, project.location?.province]
    .filter(Boolean).join(', ')

  const avatarBase64 = project.account?.avatar?.data
  const avatarSrc = avatarBase64
    ? `data:image/png;base64,${avatarBase64}`
    : '/default-avatar.png'

  const invitedStudentIds = project?.applicants
    ?.filter(applicant => applicant.status === 'invited' || applicant.status === 'declinedInvitation')
    ?.map(applicant => applicant.student?._id) || []

  return (
    <div className="">
      <div className="grid grid-cols-[1fr_0.5fr] gap-10 min-h-full">
        {/* Left Content */}
        <div className="w-full">
          <div className="flex flex-col gap-8 p-10 rounded-medium bg-white-bright">
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <div className="flex justify-between">
              <InfoBox icon={<CurrencyDollarIcon className="w-6 h-6 text-white" />} label="Mức lương" value={project.salary} />
              <InfoBox icon={<MapPinIcon className="w-6 h-6 text-white" />} label="Địa điểm" value={project.location?.province} />
              <InfoBox icon={<BriefcaseIcon className="w-6 h-6 text-white" />} label="Kinh nghiệm" value={`${project.expRequired === 0 ? 'Không yêu cầu' : (project.expRequired + ' năm')}`} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center px-3 py-1 text-sm font-medium bg-blue-100 rounded-full text-blue-mid">
                <CalendarDaysIcon className="w-4 h-4 mr-1" />
                {project.deadline ? `Hạn nộp hồ sơ : ${formatDate(project.deadline)}` : 'Chưa có thông tin'}
              </div>
              <div className="flex gap-3 ml-auto">
                {isOwner ? (
                  <ButtonArrowOne selectedPage={`/job/${project._id}`}>
                    Chỉnh sửa
                  </ButtonArrowOne>
                ) : user?.role === 'employer' ? (
                  <StatusTag
                    icon={<EyeIcon className="w-5 h-5 mr-1" />}
                    content="Chỉ được xem"
                    className="border rounded-full text-blue border-blue bg-blue-50"
                  />
                ) : applicantStatus ? (
                  (() => {
                    switch (applicantStatus) {
                      case 'pending':
                        return (
                          <StatusTag
                            icon={<ClockIconOutline className="w-5 h-5 mr-1" />}
                            content="Đang chờ duyệt"
                            className="text-yellow-500 border border-yellow-500 rounded-full bg-yellow-50"
                          />
                        )
                      case 'accepted':
                        return (
                          <StatusTag
                            icon={<CheckCircleIcon className="w-5 h-5 mr-1" />}
                            content="Đã duyệt"
                            className="text-green-500 border border-green-500 rounded-full bg-green-50"
                          />
                        )
                      case 'rejected':
                        return (
                          <StatusTag
                            icon={<XCircleIcon className="w-5 h-5 mr-1" />}
                            content="Bị từ chối"
                            hoverContent="Ứng tuyển lại"
                            className="text-red-500 border border-red-500 rounded-full cursor-pointer bg-red-50 hover:bg-red-100"
                            onClick={() => setIsOpen(true)}
                          />
                        )
                      case 'invited':
                        return (
                          <StatusTag
                            icon={<InboxArrowDownIcon className="w-5 h-5 mr-1" />}
                            content="Được mời"
                            className="text-orange-500 border border-orange-500 rounded-full bg-orange-50"
                          />
                        )
                      default:
                        return null
                    }
                  })()
                ) : (
                  <ButtonArrowOne onClick={() => setIsOpen(true)}>Ứng tuyển</ButtonArrowOne>
                )}
                <div
                  onClick={handleFavorite}
                  className="h-[46px] w-[46px] flex justify-center items-center rounded-full border-2 border-blue cursor-pointer"
                >
                  {isFavorited ? (
                    <HeartSolidIcon className="w-6 h-6 text-blue animate-pop" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-blue" />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Job Description */}
          <div className="flex flex-col gap-6 p-10 mt-10 rounded-medium bg-white-bright">
            <Section title="Chi tiết tin tuyển dụng" />
            {project.description && <ContentBlock title="Mô tả công việc" html={project.description} />}
            {project.content && <ContentBlock title="Nội dung yêu cầu" html={project.content} />}
            {locationText && <SimpleList title="Địa điểm làm việc" items={[locationText]} />}
            {project.workingTime && <SimpleList title="Thời gian làm việc" items={[project.workingTime]} />}
          </div>
        </div>
        {/* Right Sidebar */}
        <div className="w-full overflow-visible">
          <div className="sticky top-[120px]">
            {/* Company Info */}
            <div className="flex flex-col gap-5 p-10 rounded-medium bg-white-bright">
              <div className="flex items-center gap-4">
                <div className="p-3 border rounded-small border-white-low bg-white-bright">
                  <img src={avatarSrc} alt="Company" className="object-cover w-12 h-12 rounded-full" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {project.account?.role === 'employer'
                      ? project.profile?.companyName
                      : project.profile?.name || 'Vô danh'
                    }
                  </h3>
                  <p className="text-sm text-gray-500">
                    {project.account?.role === 'employer'
                      ? project.account?.email
                      : project.account?.email || 'Chưa có thông tin email'}
                  </p>
                </div>
              </div>
              {project.account.role === 'employer' ? (
                <div className='flex flex-col gap-5'>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <ListItem icon={<UsersIcon />} label="Quy mô" value={(project.profile?.businessScale === 'Companies' ? 'Công ty' : 'Cá nhân')} />
                    <ListItem icon={<TagIcon />} label="Lĩnh vực" value={project.profile?.industry || 'Chưa có'} />
                    <ListItem icon={<MapPinIcon />} label="Địa điểm" value={project.profile?.address || 'Chưa có'} />
                  </ul>
                  <Link to={`/employer-detail/${project.account?._id}`} className="w-full text-center px-4 py-2.5 text-white bg-blue hover:bg-blue-600 rounded-full cursor-pointer">
                    Xem chi tiết
                  </Link>
                </div>
              ) : (
                <ul className="space-y-2 text-sm text-gray-700">
                  <ListItem icon={<BuildingLibraryIcon />} label="Trường" value={(project.profile?.university) || 'Chưa có'} />
                  <ListItem icon={<BookOpenIcon />} label="Ngành" value={project.profile?.major?.name || 'Chưa có'} />
                  <ListItem icon={<TagIcon />} label="Chuyên ngành" value={project.profile?.specialization?.name || 'Chưa có'} />
                </ul>
              )}
            </div>
            {/* General Info */}
            <div className="flex flex-col gap-5 p-10 mt-10 rounded-medium bg-white-bright">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">Thông tin chung</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <ListItem icon={<AcademicCapIcon />} label="Học vấn" value={project.education || 'Không yêu cầu'} />
                <ListItem icon={<Bars3CenterLeftIcon />} label="GPA" value={project.gpa || 'Không yêu cầu'} />
                <ListItem icon={<UserGroupIcon />} label="Số lượng tuyển" value={project.hiringCount || '1'} />
                <ListItem icon={<ClockIcon />} label="Hình thức làm việc" value={project.workType || 'Không rõ'} />
              </ul>
            </div>
          </div>
        </div>
      </div>

      {user?.role === 'student' && (
        <div className='w-full p-10 mt-10 overflow-hidden bg-white-bright rounded-medium'>
          <RcmJob id={project._id} title={<Section title="Tuyển dụng tương tự" />} />
        </div>
      )}

      {isOwner && (
        <div className='w-full p-10 mt-10 overflow-hidden bg-white-bright rounded-medium'>
          <RcmStudent
            id={project._id}
            title={<Section title="Ứng viên phù hợp" />}
            isOwner={isOwner}
            projectId={id}
            toast={toast}
            reload={fetchFullProjectData}
            invitedStudentIds={invitedStudentIds}
          />
        </div>
      )}
    </div>
  )
}

// Reusable Subcomponents
const InfoBox = ({ icon, label, value }) => (
  <div className="flex flex-1 items-center gap-2.5">
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue">{icon}</div>
    <div>
      <p className="text-sm text-black-low">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
)

const Section = ({ title }) => (
  <div className="flex items-center gap-2.5">
    <div className="w-1.5 bg-blue rounded-[5px] self-stretch"></div>
    <h3 className="text-xl font-bold">{title}</h3>
  </div>
)

const ContentBlock = ({ title, html }) => (
  <div>
    <h4 className="mb-2 font-semibold">{title}</h4>
    <div
      className="pl-5 text-sm text-black-low tinymce-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  </div>
)

const ListItem = ({ icon, label, value }) => (
  <li className="flex items-center justify-between">
    <span className="flex items-center space-x-2">
      <span className="w-5 h-5 text-blue">{icon}</span>
      <span>{label}</span>
    </span>
    <span className="font-medium">{value}</span>
  </li>
)

const SimpleList = ({ title, items }) => (
  <div>
    <h4 className="mb-2 font-semibold">{title}</h4>
    <ul className="pl-5 space-y-1 text-sm list-disc list-inside">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </div>
)

const StatusTag = ({ icon, content, hoverContent, className, ...props }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <span
      className={`flex items-center px-3 py-2 font-medium transition-colors ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {icon}
      {isHovered && hoverContent ? hoverContent : content}
    </span>
  )
}

export default JobInfo
