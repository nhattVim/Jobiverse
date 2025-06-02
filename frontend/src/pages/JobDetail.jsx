import {
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon, // Sử dụng cho Kinh nghiệm (thay thế AcademicCapIcon nếu hợp lý hơn)
  CalendarDaysIcon, // Hạn nộp hồ sơ
  UsersIcon, // Quy mô
  TagIcon, // Lĩnh vực
  BuildingOfficeIcon, // Địa điểm công ty
  BookOpenIcon, // Học vấn
  Bars3CenterLeftIcon, // GPA (placeholder)
  UserGroupIcon, // Số lượng tuyển
  ClockIcon, // Hình thức làm việc
  HeartIcon as HeartSolidIcon
} from '@heroicons/react/24/solid'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import Banner from '../components/Banner'
import { useContext, useEffect, useState } from 'react'
import apiFetch from '../services/api'
import { useParams, useSearchParams } from 'react-router-dom'
import ApplyPopup from '../components/ApplyPopup'
import UserContext from '../contexts/UserContext'
import {
  CheckCircleIcon,
  ClockIcon as ClockIconOutline,
  HeartIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const JobDetail = () => {
  const { id } = useParams()
  const { user } = useContext(UserContext)
  const [searchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(searchParams.get('openApply') || false)
  const [projectData, setProjectData] = useState({})
  const [profile, setProfile] = useState({})
  const isFavoritedInitial = searchParams.get('isFavorited') === 'true'
  const [isFavorited, setIsFavorited] = useState(isFavoritedInitial)

  const handleFavorite = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để sử dụng chức năng này!')
      return
    }
    const newFavoriteState = !isFavorited
    setIsFavorited(newFavoriteState)

    try {
      if (newFavoriteState) {
        await apiFetch('/favorites', 'POST', { projectId: projectData._id })
      } else {
        await apiFetch(`/favorites/${projectData._id}`, 'DELETE')
      }
    } catch (err) {
      console.error('Failed to save favorite state', err)
      setIsFavorited(!newFavoriteState)
    }
  }

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (user.role === 'student') {
          const student = await apiFetch('/students/me', 'GET')
          setProfile(student)
        }
      } catch (err) {
        console.log('Fetch data failed:', err)
      }
    }
    fetchStudent()
  }, [user])

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const data = await apiFetch(`/projects/my/${id}`, 'GET')
        setProjectData(data)
      } catch (err) {
        console.log('Error fetch project data', err.message)
      }
    }
    fetchProjectDetail()
  }, [id])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <ApplyPopup
          setIsOpen={setIsOpen}
          applyTitle={projectData.title}
          projectId={projectData._id}
        />
      )}
      <Banner />
      <div className="w-full py-20">
        <main className="container-responsive">
          <div className="grid grid-cols-[1fr_0.5fr] gap-10 min-h-full ">
            <div className="overflow-visible w-full ">
              <div className="sticky top-[80px]">
                <div className="flex flex-col gap-[30px] p-10 rounded-medium bg-white-bright">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {projectData.title}
                  </h2>
                  <div className="inline-flex justify-start items-center text-sm">
                    <div className="flex flex-1 items-center gap-2.5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue">
                        <CurrencyDollarIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-black-low">Mức lương</span>
                        <span className="font-semibold">
                          {projectData.salary}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center gap-2.5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue">
                        <MapPinIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-black-low">Địa điểm</span>
                        <span className="font-semibold">
                          {projectData.location?.province}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center gap-2.5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue">
                        <BriefcaseIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-black-low">Kinh nghiệm</span>
                        <span className="font-semibold">
                          {projectData.expRequired} năm
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center bg-blue-100 text-blue-mid px-3 py-1 rounded-full text-sm font-medium">
                      <CalendarDaysIcon className="h-4 w-4 mr-1" />
                      Hạn nộp hồ sơ:{' '}
                      {new Date(projectData.deadline).toLocaleDateString()}
                    </div>

                    <div className="flex ml-auto gap-4">
                      {projectData.applicants &&
                      projectData.applicants.some(
                        (data) => data && data.student === profile._id
                      ) ? (
                          (() => {
                            const applicant = projectData.applicants?.find(
                              (data) => data && data.student === profile._id
                            )
                            let status = applicant?.status
                            switch (status) {
                            case 'pending':
                              return (
                                <span className="flex items-center px-3 py-2 rounded-full bg-yellow-50 text-yellow-500 border border-yellow-500 font-medium">
                                  <ClockIconOutline className="h-5 w-5 mr-1" />
                                  Đang chờ duyệt
                                </span>
                              )
                            case 'accepted':
                              return (
                                <span className="flex items-center px-3 py-2 rounded-full bg-green-50 text-green-500 border border-green-500 font-medium">
                                  <CheckCircleIcon className="h-5 w-5 mr-1" />
                                  Đã duyệt
                                </span>
                              )
                            case 'rejected':
                              return (
                                <span className="flex items-center px-3 py-2 rounded-full bg-red-50 text-red-500 border border-red-500 font-medium">
                                  <XCircleIcon className="h-5 w-5 mr-1" />
                                  Bị từ chối
                                </span>
                              )
                            default:
                              return null
                            }
                          })()
                        ) : (
                          <ButtonArrowOne onClick={() => setIsOpen(true)}>
                          Ứng tuyển
                          </ButtonArrowOne>
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
                <div className="flex flex-col gap-6 p-10 rounded-medium bg-white-bright mt-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 self-stretch bg-blue rounded-[5px]"></div>
                    <h3 className="text-xl font-bold">
                      Chi tiết tin tuyển dụng
                    </h3>
                  </div>
                  {projectData.description && (
                    <div className="">
                      <h4 className="font-semibold mb-2">Mô tả công việc</h4>
                      <div
                        className="tinymce-content pl-5 text-sm text-black-low"
                        dangerouslySetInnerHTML={{
                          __html: projectData.description
                        }}
                      ></div>
                    </div>
                  )}
                  {projectData.content && (
                    <div className="">
                      <h4 className="font-semibold mb-2">Nội dung yêu cầu</h4>
                      <div
                        className="tinymce-content pl-5 text-sm text-black-low"
                        dangerouslySetInnerHTML={{
                          __html: projectData.content
                        }}
                      ></div>
                    </div>
                  )}
                  <div className="">
                    <h4 className="font-semibold mb-2">Địa điểm làm việc</h4>
                    <ul className="list-disc list-inside pl-5 text-sm space-y-1">
                      <li>
                        {[
                          projectData.location?.ward,
                          projectData.location?.district,
                          projectData.location?.province
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </li>
                    </ul>
                  </div>
                  {projectData.workingTime && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Thời gian làm việc</h4>
                      <ul className="list-disc list-inside pl-5 text-sm space-y-1">
                        <li>{projectData.workingTime}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cột phải: Thông tin công ty */}
            <div className="overflow-visible w-full">
              <div className="sticky top-[100px]">
                <div className="flex flex-col gap-5 p-10 rounded-medium bg-white-bright">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white-bright border border-white-low rounded-small flex justify-center items-center">
                      <img
                        src={`data:image/png;base64,${projectData.account?.avatar?.data}`}
                        alt="imgcompany"
                        className="object-cover w-15 h-15 rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{}</h3>
                    </div>
                  </div>
                  <ul className="mb-4 space-y-2 text-sm text-gray-700">
                    <li className="flex items-center space-x-2">
                      <UsersIcon className="h-4 w-4 text-gray-500" />
                      <span>Quy mô: {}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TagIcon className="h-4 w-4 text-gray-500" />
                      <span>Lĩnh vực: {}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <BuildingOfficeIcon className="h-4 w-4 text-gray-500" />
                      <span>Địa điểm: {}</span>
                    </li>
                  </ul>
                  <button className="w-full px-4 py-2 text-blue-700 transition duration-300 bg-blue-100 rounded-lg hover:bg-blue-200">
                    Xem chi tiết
                  </button>
                </div>

                <div className="flex flex-col gap-5 p-10 rounded-medium bg-white-bright mt-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Thông tin chung
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <BookOpenIcon className="w-4 h-4 text-blue-500" />
                        <span>Học vấn</span>
                      </span>
                      <span className="font-medium">{}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <Bars3CenterLeftIcon className="w-4 h-4 text-blue-500" />{' '}
                        {/* Icon placeholder cho GPA */}
                        <span>GPA</span>
                      </span>
                      <span className="font-medium">{}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <UserGroupIcon className="w-4 h-4 text-blue-500" />
                        <span>Số lượng tuyển</span>
                      </span>
                      <span className="font-medium">{}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-blue-500" />
                        <span>Hình thức làm việc</span>
                      </span>
                      <span className="font-medium">{}</span>
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
