import {
  MapPinIcon, CurrencyDollarIcon, BriefcaseIcon,
  CalendarDaysIcon, HeartIcon, UsersIcon, TagIcon,
  BuildingOfficeIcon, BookOpenIcon, Bars3CenterLeftIcon,
  UserGroupIcon, ClockIcon, PencilSquareIcon
} from '@heroicons/react/24/solid'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import Banner from '../components/Banner'
import { useEffect, useState, useContext } from 'react'
import apiFetch from '../services/api'
import { useParams, useSearchParams } from 'react-router-dom'
import ApplyPopup from '../components/ApplyPopup'
import UserContext from '../contexts/UserContext'

const JobDetail = () => {
  const [searchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(searchParams.get('openApply') || false)
  const [projectData, setProjectData] = useState({})
  const { id } = useParams()
  const { user } = useContext(UserContext)
  const isOwner = projectData.account?._id === user._id

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
      {isOpen && <ApplyPopup setIsOpen={setIsOpen} applyTitle={projectData.title} />}
      <Banner />
      <div className="w-full py-20">
        <main className="container-responsive">
          <div className="grid grid-cols-[1fr_0.5fr] gap-10 min-h-full ">
            <div className="w-full overflow-visible ">
              <div className="sticky top-[80px]">
                <div className="flex flex-col gap-[30px] p-10 rounded-medium bg-white-bright">

                  <div className='flex items-center justify-between mb-4'>
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">
                      {projectData.title}
                    </h2>

                    {isOwner && (
                      <PencilSquareIcon className="w-6 h-6 text-gray-500 " />
                    )}
                  </div>

                  <div className="inline-flex items-center justify-start text-sm">
                    <div className="flex flex-1 items-center gap-2.5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue">
                        <CurrencyDollarIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className='text-black-low'>Mức lương</span>
                        <span className="font-semibold">
                          {projectData.salary}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center gap-2.5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue">
                        <MapPinIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className='text-black-low'>Địa điểm</span>
                        <span className="font-semibold">
                          {projectData.location?.province}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center gap-2.5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue">
                        <BriefcaseIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className='text-black-low'>Kinh nghiệm</span>
                        <span className="font-semibold">
                          {projectData.expRequired} năm
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center px-3 py-1 text-sm font-medium bg-blue-100 rounded-full text-blue-mid">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      Hạn nộp hồ sơ: {new Date(projectData.deadline).toLocaleString()}
                    </div>
                    <div className="flex gap-4 ml-auto">
                      <ButtonArrowOne onClick={() => setIsOpen(true)}>Ứng tuyển</ButtonArrowOne>
                      <button className="flex items-center justify-center w-10 h-10 p-2 text-blue-500 transition duration-300 border border-blue-500 rounded-full hover:bg-yellow-500">
                        <HeartIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-6 p-10 mt-10 rounded-medium bg-white-bright">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 self-stretch bg-blue rounded-[5px]"></div>
                    <h3 className="text-xl font-bold">
                      Chi tiết tin tuyển dụng
                    </h3>
                  </div>
                  {projectData.description && (
                    <div className="">
                      <h4 className="mb-2 font-semibold">
                        Mô tả công việc
                      </h4>
                      <div className="pl-5 text-sm tinymce-content text-black-low" dangerouslySetInnerHTML={{ __html: projectData.description }}></div>
                    </div>
                  )}
                  {projectData.content && (
                    <div className="">
                      <h4 className="mb-2 font-semibold">
                        Nội dung yêu cầu
                      </h4>
                      <div className="pl-5 text-sm tinymce-content text-black-low" dangerouslySetInnerHTML={{ __html: projectData.content }}></div>
                    </div>
                  )}
                  <div className="">
                    <h4 className="mb-2 font-semibold">
                      Địa điểm làm việc
                    </h4>
                    <ul className="pl-5 space-y-1 text-sm list-disc list-inside">
                      <li>
                        {[projectData.location?.ward, projectData.location?.district, projectData.location?.province]
                          .filter(Boolean)
                          .join(', ')}
                      </li>
                    </ul>
                  </div>
                  {projectData.workingTime && (
                    <div className="mb-4">
                      <h4 className="mb-2 font-semibold">
                        Thời gian làm việc
                      </h4>
                      <ul className="pl-5 space-y-1 text-sm list-disc list-inside">
                        <li>{projectData.workingTime}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cột phải: Thông tin công ty */}
            <div className="w-full overflow-visible">
              <div className="sticky top-[100px]">
                <div className="flex flex-col gap-5 p-10 rounded-medium bg-white-bright">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center p-3 border bg-white-bright border-white-low rounded-small">
                      <img
                        src={`data:image/png;base64,${projectData.account?.avatar?.data}`}
                        alt="imgcompany"
                        className="object-cover rounded-full w-15 h-15"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        { }
                      </h3>
                    </div>
                  </div>
                  <ul className="mb-4 space-y-2 text-sm text-gray-700">
                    <li className="flex items-center space-x-2">
                      <UsersIcon className="w-4 h-4 text-gray-500" />
                      <span>Quy mô: { }</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TagIcon className="w-4 h-4 text-gray-500" />
                      <span>Lĩnh vực: { }</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                      <span>Địa điểm: { }</span>
                    </li>
                  </ul>
                  <button className="w-full px-4 py-2 text-blue-700 transition duration-300 bg-blue-100 rounded-lg hover:bg-blue-200">
                    Xem chi tiết
                  </button>
                </div>

                <div className="flex flex-col gap-5 p-10 mt-5 rounded-medium bg-white-bright">
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
                        { }
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <Bars3CenterLeftIcon className="w-4 h-4 text-blue-500" />{' '}
                        {/* Icon placeholder cho GPA */}
                        <span>GPA</span>
                      </span>
                      <span className="font-medium">
                        { }
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <UserGroupIcon className="w-4 h-4 text-blue-500" />
                        <span>Số lượng tuyển</span>
                      </span>
                      <span className="font-medium">
                        { }
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-blue-500" />
                        <span>Hình thức làm việc</span>
                      </span>
                      <span className="font-medium">
                        { }
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
