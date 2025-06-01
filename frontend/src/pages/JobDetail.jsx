import {
  MapPinIcon, CurrencyDollarIcon, BriefcaseIcon,
  CalendarDaysIcon, HeartIcon, UsersIcon, TagIcon,
  BuildingOfficeIcon, BookOpenIcon, Bars3CenterLeftIcon,
  UserGroupIcon, ClockIcon
} from '@heroicons/react/24/solid'

import { useEffect, useCallback, useState, useContext } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import Banner from '../components/Banner'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import ApplyPopup from '../components/ApplyPopup'
import UserContext from '../contexts/UserContext'
import apiFetch from '../services/api'

const JobDetail = () => {
  const { id } = useParams()
  const { user } = useContext(UserContext)
  const [searchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(searchParams.get('openApply') === 'true')

  const [project, setProject] = useState(null)
  const [applicantDetails, setApplicantDetails] = useState([])
  const [acceptedDetails, setAcceptedDetails] = useState([])

  const isOwner = project?.account?._id === user?._id

  const fetchFullProjectData = useCallback(async () => {
    try {
      const res = await apiFetch(`/projects/${id}`, 'GET')
      setProject(res)

      if (res?.applicants?.length) {
        const applicantData = await Promise.all(
          res.applicants.map(id => apiFetch(`/students/${id}`, 'GET'))
        )
        setApplicantDetails(applicantData)
      } else {
        setApplicantDetails([])
      }

      if (res?.assignedStudents?.length) {
        const acceptedData = await Promise.all(
          res.assignedStudents.map(id => apiFetch(`/students/${id}`, 'GET'))
        )
        setAcceptedDetails(acceptedData)
      } else {
        setAcceptedDetails([])
      }

    } catch (error) {
      console.error('Error fetching project data:', error)
    }
  }, [id])

  useEffect(() => {
    fetchFullProjectData()
  }, [fetchFullProjectData])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isOpen)
    return () => document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  const handleApplyClick = async (studentId, action) => {
    try {
      await apiFetch(`/projects/${id}/respond/${studentId}`, 'POST', { action })
      await fetchFullProjectData() // Refresh all data
    } catch (error) {
      console.error('Failed to handle apply click:', error)
    }
  }

  if (!project) {
    return (
      <>
        <Banner />
        <div className="text-center py-50">Đang tải thông tin công việc...</div>
      </>
    )
  }

  const locationText = [project.location?.ward, project.location?.district, project.location?.province]
    .filter(Boolean).join(', ')

  const avatarBase64 = project.account?.avatar?.data
  const avatarSrc = avatarBase64
    ? `data:image/png;base64,${avatarBase64}`
    : '/default-avatar.png'


  return (
    <>
      {isOpen && <ApplyPopup setIsOpen={setIsOpen} applyTitle={project.title} />}
      <Banner />
      <div className="w-full py-20">
        <main className="container-responsive">
          <div className="grid grid-cols-[1fr_0.5fr] gap-10 min-h-full">

            {/* Left Content */}
            <div className="w-full overflow-visible">
              <div className="sticky top-[80px]">
                <div className="flex flex-col gap-8 p-10 rounded-medium bg-white-bright">
                  <h2 className="text-2xl font-bold">{project.title}</h2>

                  <div className="flex justify-between">
                    <InfoBox icon={<CurrencyDollarIcon className="w-6 h-6 text-white" />} label="Mức lương" value={project.salary} />
                    <InfoBox icon={<MapPinIcon className="w-6 h-6 text-white" />} label="Địa điểm" value={project.location?.province} />
                    <InfoBox icon={<BriefcaseIcon className="w-6 h-6 text-white" />} label="Kinh nghiệm" value={`${project.expRequired} năm`} />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center px-3 py-1 text-sm font-medium bg-blue-100 rounded-full text-blue-mid">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      Hạn nộp hồ sơ: {new Date(project.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex gap-3 ml-auto">
                      <ButtonArrowOne onClick={() => setIsOpen(true)}>Ứng tuyển</ButtonArrowOne>
                      <button className="w-10 h-10 p-2 text-blue-500 border border-blue-500 rounded-full hover:bg-yellow-500">
                        <HeartIcon className="w-5 h-5" />
                      </button>
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
            </div>

            {/* Right Sidebar */}
            <div className="w-full overflow-visible">
              <div className="sticky top-[100px]">

                {/* Company Info */}
                <div className="flex flex-col gap-5 p-10 rounded-medium bg-white-bright">
                  <div className="flex items-center gap-4">
                    <div className="p-3 border rounded-small border-white-low bg-white-bright">
                      <img src={avatarSrc} alt="Company" className="object-cover rounded-full w-15 h-15" />
                    </div>
                    <h3 className="text-xl font-bold">{project.account?.name}</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <ListItem icon={<UsersIcon />} label="Quy mô" value={project.account?.scale || 'Chưa có'} />
                    <ListItem icon={<TagIcon />} label="Lĩnh vực" value={project.account?.industry || 'Chưa có'} />
                    <ListItem icon={<BuildingOfficeIcon />} label="Địa điểm" value={project.account?.location || 'Chưa có'} />
                  </ul>
                  <button className="w-full px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200">
                    Xem chi tiết
                  </button>
                </div>

                {/* General Info */}
                <div className="flex flex-col gap-5 p-10 mt-5 rounded-medium bg-white-bright">
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">Thông tin chung</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <ListItem icon={<BookOpenIcon />} label="Học vấn" value={project.education || 'Không yêu cầu'} />
                    <ListItem icon={<Bars3CenterLeftIcon />} label="GPA" value={project.gpa || 'Không yêu cầu'} />
                    <ListItem icon={<UserGroupIcon />} label="Số lượng tuyển" value={project.quantity || '1'} />
                    <ListItem icon={<ClockIcon />} label="Hình thức làm việc" value={project.workForm || 'Không rõ'} />
                  </ul>
                </div>

                {/* Applicants (Owner view) */}
                {isOwner && (
                  <div className="flex flex-col gap-5 p-10 mt-5 rounded-medium bg-white-bright">
                    <h3 className="text-xl font-semibold">Danh sách ứng viên ứng tuyển</h3>
                    {applicantDetails.length === 0 ? (
                      <p className="text-gray-500">Chưa có ai ứng tuyển.</p>
                    ) : (
                      applicantDetails.map((student, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={`data:image/png;base64,${student.account?.avatar?.data}`}
                              alt={student.name}
                              className="object-cover w-10 h-10 rounded-full"
                            />
                            <div>
                              <h4 className="text-lg font-semibold">{student.name}</h4>
                              <p className="text-sm text-gray-500">{student.account?.email}</p>
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() => handleApplyClick(student._id, 'accept')}
                              className="p-2 text-white bg-green-600 rounded-lg cursor-pointer hover:bg-green-700"
                            >
                              Accept
                            </button>

                            <button
                              className="p-2 text-white bg-red-600 rounded-lg cursor-pointer hover:bg-red-700"
                              onClick={() => handleApplyClick(student._id, 'reject')}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-5 p-10 mt-5 rounded-medium bg-white-bright">
                  <h3 className="text-xl font-semibold">Danh sách sinh viên đã vào dự án</h3>
                  {acceptedDetails.length === 0 ? (
                    <p className="text-gray-500">Chưa có sinh viên</p>
                  ) : (
                    acceptedDetails.map((student, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={`data:image/png;base64,${student.account?.avatar?.data}`}
                            alt={student.name}
                            className="object-cover w-10 h-10 rounded-full"
                          />
                          <div>
                            <h4 className="text-lg font-semibold">{student.name}</h4>
                            <p className="text-sm text-gray-500">{student.account?.email}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </>
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
    <div className="pl-5 text-sm text-black-low tinymce-content" dangerouslySetInnerHTML={{ __html: html }} />
  </div>
)

const SimpleList = ({ title, items }) => (
  <div>
    <h4 className="mb-2 font-semibold">{title}</h4>
    <ul className="pl-5 space-y-1 text-sm list-disc list-inside">
      {items.map((item, idx) => <li key={idx}>{item}</li>)}
    </ul>
  </div>
)

const ListItem = ({ icon, label, value }) => (
  <li className="flex items-center justify-between">
    <span className="flex items-center space-x-2">
      <span className="w-4 h-4 text-blue-500">{icon}</span>
      <span>{label}</span>
    </span>
    <span className="font-medium">{value}</span>
  </li>
)

export default JobDetail
