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
import { useEffect, useState } from 'react'
import apiFetch from '../services/api'
import { useParams, useSearchParams } from 'react-router-dom'
import ApplyPopup from '../components/ApplyPopup'

const JobDetail = () => {
  const [searchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(searchParams.get('openApply') || false)
  const [projectData, setProjectData] = useState({})
  const { id } = useParams()
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
  }, [])

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
      {isOpen && <ApplyPopup setIsOpen={setIsOpen} applyTitle={projectData.title} /> }
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
                        <span className='text-black-low'>Mức lương</span>
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
                        <span className='text-black-low'>Địa điểm</span>
                        <span className="font-semibold">
                          {projectData.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center gap-2.5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue">
                        <BriefcaseIcon className="h-6 w-6 text-white" />
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
                    <div className="flex items-center bg-blue-100 text-blue-mid px-3 py-1 rounded-full text-sm font-medium">
                      <CalendarDaysIcon className="h-4 w-4 mr-1" />
                      Hạn nộp hồ sơ: {new Date(projectData.deadline).toLocaleString()}
                    </div>
                    <div className="flex ml-auto gap-4">
                      <ButtonArrowOne onClick={() => setIsOpen(true)}>Ứng tuyển</ButtonArrowOne>
                      <button className="p-2 rounded-full border border-blue-500 text-blue-500 hover:bg-yellow-500 transition duration-300 flex items-center justify-center w-10 h-10">
                        <HeartIcon className="h-5 w-5" />
                      </button>
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
                      <h4 className="font-semibold mb-2">
                        Mô tả công việc
                      </h4>
                      <div className="tinymce-content pl-5 text-sm text-black-low" dangerouslySetInnerHTML={{ __html: projectData.description }}></div>
                    </div>
                  )}
                  {projectData.content && (
                    <div className="">
                      <h4 className="font-semibold mb-2">
                        Nội dung yêu cầu
                      </h4>
                      <div className="tinymce-content pl-5 text-sm text-black-low" dangerouslySetInnerHTML={{ __html: projectData.content }}></div>
                    </div>
                  )}
                  {projectData.location && (
                    <div className="">
                      <h4 className="font-semibold mb-2">
                        Địa điểm làm việc
                      </h4>
                      <ul className="list-disc list-inside pl-5 text-sm space-y-1">
                        <li>{projectData.location}</li>
                      </ul>
                    </div>
                  )}
                  {projectData.workingTime && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">
                        Thời gian làm việc
                      </h4>
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
                      <h3 className="text-xl font-bold text-gray-800">
                        {}
                      </h3>
                    </div>
                  </div>
                  <ul className="text-gray-700 text-sm space-y-2 mb-4">
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
                  <button className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition duration-300">
                    Xem chi tiết
                  </button>
                </div>

                <div className="flex flex-col gap-5 p-10 rounded-medium bg-white-bright mt-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Thông tin chung
                  </h3>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <BookOpenIcon className="h-4 w-4 text-blue-500" />
                        <span>Học vấn</span>
                      </span>
                      <span className="font-medium">
                        {}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <Bars3CenterLeftIcon className="h-4 w-4 text-blue-500" />{' '}
                        {/* Icon placeholder cho GPA */}
                        <span>GPA</span>
                      </span>
                      <span className="font-medium">
                        {}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <UserGroupIcon className="h-4 w-4 text-blue-500" />
                        <span>Số lượng tuyển</span>
                      </span>
                      <span className="font-medium">
                        {}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4 text-blue-500" />
                        <span>Hình thức làm việc</span>
                      </span>
                      <span className="font-medium">
                        {}
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
