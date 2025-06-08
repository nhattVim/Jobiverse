/* eslint-disable indent */
import {
  MapPinIcon, CurrencyDollarIcon, BriefcaseIcon, CalendarDaysIcon,
  UsersIcon, TagIcon, BuildingOfficeIcon, BookOpenIcon, Bars3CenterLeftIcon,
  UserGroupIcon, ClockIcon, HeartIcon as HeartSolidIcon,
  AcademicCapIcon
} from '@heroicons/react/24/solid'

import {
  CheckCircleIcon, ClockIcon as ClockIconOutline, HeartIcon, XCircleIcon
} from '@heroicons/react/24/outline'

import { useEffect, useCallback, useState, useContext } from 'react'
import { useParams, useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom'

import Banner from '../components/Banner'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import ApplyPopup from '../components/ApplyPopup'
import UserContext from '../contexts/UserContext'
import apiFetch from '../services/api'
import CVPreviewModal from '../components/CVPreviewModal'
import PdfModal from '../components/PdfModal'
import { ToastContainer, toast } from 'react-toastify'
import { ApplicationStatusContext } from '../contexts/ApplicationStatusContext'
import { formatDate } from '../utils/dateUtils'

const JobDetail = () => {
  const { id } = useParams()
  const { user } = useContext(UserContext)
  const { statusMap, loading } = useContext(ApplicationStatusContext)
  const [searchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(searchParams.get('openApply') === 'true')
  const isFavoritedInitial = searchParams.get('isFavorited') === 'true'
  const [isFavorited, setIsFavorited] = useState(isFavoritedInitial)
  const location = useLocation()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [applicantDetails, setApplicantDetails] = useState([])
  const [acceptedDetails, setAcceptedDetails] = useState([])
  const [previewId, setPreviewId] = useState(null)
  const [cvType, setCvType] = useState('')

  const isOwner = project?.account?._id === user?._id

  const fetchFullProjectData = useCallback(async () => {
    try {
      const res = await apiFetch(`/projects/${id}`, 'GET')
      setProject(res)

      let pending = []
      let accepted = []

      res.applicants?.forEach(applicant => {
        if (applicant.status === 'pending') {
          pending.push(applicant)
        } else if (applicant.status === 'accepted') {
          accepted.push(applicant)
        }
      })

      setApplicantDetails(pending)
      setAcceptedDetails(accepted)
    } catch (error) {
      console.error('Error fetching project data:', error)
    }
  }, [id])

  const handleFavorite = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để sử dụng chức năng này!')
      return
    }
    const newFavoriteState = !isFavorited
    setIsFavorited(newFavoriteState)

    try {
      if (newFavoriteState) {
        await apiFetch('/favorites', 'POST', { projectId: project._id })
      } else {
        await apiFetch(`/favorites/${project._id}`, 'DELETE')
      }
    } catch (err) {
      console.error('Failed to save favorite state', err)
      setIsFavorited(!newFavoriteState)
    }
  }

  useEffect(() => {
    fetchFullProjectData()
  }, [isOpen, fetchFullProjectData])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isOpen)
    return () => document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  const handleApplyClick = async (studentId, action) => {
    try {
      await apiFetch(`/projects/${id}/respond/${studentId}`, 'POST', { action })
      await fetchFullProjectData()
    } catch (error) {
      console.error('Failed to handle apply click:', error)
    }
  }

  if (!project || loading) {
    return (
      <>
        <Banner />
        <div className="text-center py-50">Đang tải thông tin công việc...</div>
      </>
    )
  }

  const closePopup = () => {
    setIsOpen(false)
    const params = new URLSearchParams(location.search)
    params.delete('openApply')
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
  }

  const locationText = [project.location?.ward, project.location?.district, project.location?.province]
    .filter(Boolean).join(', ')

  const avatarBase64 = project.account?.avatar?.data
  const avatarSrc = avatarBase64
    ? `data:image/png;base64,${avatarBase64}`
    : '/default-avatar.png'

  const applicantStatus = statusMap[project._id]?.status

  console.log('Applicant Details:', applicantDetails)
  console.log('Accepted Details:', acceptedDetails)
  console.log('Project:', project)

  return (
    <>
      {isOpen && <ApplyPopup closePopup={closePopup} applyTitle={project.title} projectId={project._id} toast={toast} />}

      {previewId && (
        cvType === 'CVUpload' ? (
          <PdfModal
            cvId={previewId}
            onClose={() => setPreviewId(null)}
          />
        ) : (
          <CVPreviewModal
            cvId={previewId}
            onClose={() => setPreviewId(null)}
          />
        )
      )}

      <ToastContainer position="top-right" autoClose={2000} />
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
                      {project.deadline ? `Hạn nộp hồ sơ : ${formatDate(project.deadline)}` : 'Chưa có thông tin'}
                    </div>
                    <div className="flex gap-3 ml-auto">
                      {isOwner ? (
                        <ButtonArrowOne selectedPage={`/job/${project._id}`}>
                          Chỉnh sửa
                        </ButtonArrowOne>
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
            </div>

            {/* Right Sidebar */}
            <div className="w-full overflow-visible">
              <div className="sticky top-[100px]">

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
                  <ul className="space-y-2 text-sm text-gray-700">
                    <ListItem icon={<UsersIcon />} label="Quy mô" value={(project.profile?.businessScale === 'Companies' ? 'Công ty' : 'Cá nhân')} />
                    <ListItem icon={<TagIcon />} label="Lĩnh vực" value={project.profile?.industry || 'Chưa có'} />
                    <ListItem icon={<MapPinIcon />} label="Địa điểm" value={project.profile?.address || 'Chưa có'} />
                  </ul>
                  <Link to={'/employer-detail'} className="w-full text-center px-4 py-2.5 text-white bg-blue hover:bg-blue-600 rounded-full cursor-pointer">
                    Xem chi tiết
                  </Link>
                </div>

                {/* General Info */}
                <div className="flex flex-col gap-5 p-10 mt-5 rounded-medium bg-white-bright">
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">Thông tin chung</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <ListItem icon={<AcademicCapIcon />} label="Học vấn" value={project.education || 'Không yêu cầu'} />
                    <ListItem icon={<Bars3CenterLeftIcon />} label="GPA" value={project.gpa || 'Không yêu cầu'} />
                    <ListItem icon={<UserGroupIcon />} label="Số lượng tuyển" value={project.hiringCount || '1'} />
                    <ListItem icon={<ClockIcon />} label="Hình thức làm việc" value={project.workType || 'Không rõ'} />
                  </ul>
                </div>

                {/* Applicants (Owner view) */}
                {isOwner && (
                  <div className="flex flex-col gap-5 p-10 mt-5 rounded-medium bg-white-bright">
                    <h3 className="text-xl font-semibold">Danh sách ứng viên ứng tuyển</h3>
                    {applicantDetails.length === 0 ? (
                      <p className="text-gray-500">Chưa có ai ứng tuyển.</p>
                    ) : (
                      applicantDetails.map((s, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={`data:image/png;base64,${s.student.account?.avatar?.data}`}
                              alt={s.student.name}
                              className="object-cover w-10 h-10 rounded-full"
                            />
                            <div>
                              <h4
                                className="text-lg font-semibold cursor-pointer hover:underline hover:text-blue-600"
                                onClick={() => {
                                  setPreviewId(s.cv)
                                  setCvType(s.cvType)
                                }}
                              >{s.student.name}</h4>
                              <p className="text-sm text-gray-500">{s.student.account?.email}</p>
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() => handleApplyClick(s.student._id, 'accept')}
                              className="p-2 text-white bg-green-600 rounded-lg cursor-pointer hover:bg-green-700"
                            >
                              Accept
                            </button>

                            <button
                              className="p-2 text-white bg-red-600 rounded-lg cursor-pointer hover:bg-red-700"
                              onClick={() => handleApplyClick(s.student._id, 'reject')}
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
                    acceptedDetails.map((s, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={`data:image/png;base64,${s.student.account?.avatar?.data}`}
                            alt={s.student.name}
                            className="object-cover w-10 h-10 rounded-full"
                          />
                          <div>
                            <h4
                              className="text-lg font-semibold cursor-pointer hover:underline hover:text-blue-600"
                              onClick={() => {
                                setPreviewId(s.cv)
                                setCvType(s.cvType)
                              }}
                            >{s.student.name}</h4>
                            <p className="text-sm text-gray-500">{s.student.account?.email}</p>
                          </div>
                        </div>
                      </div>
                    )))
                  }
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
      <span className="w-5 h-5 text-blue">{icon}</span>
      <span>{label}</span>
    </span>
    <span className="font-medium">{value}</span>
  </li>
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

export default JobDetail
