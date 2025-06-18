import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import { useEffect, useState } from 'react'
import apiFetch from '../services/api'
import { useParams } from 'react-router-dom'
import { EnvelopeIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/solid'

const EmployerDetail = () => {
  const { id } = useParams()
  const [employerDetail, setEmployerDetail] = useState({})
  const [jobsOfEmployer, setJobsOfEmployer] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employerRes, jobsRes] = await Promise.all([
          apiFetch(`/employers/detail/${id}`, 'GET'),
          apiFetch(`/projects/employer/${id}`, 'GET')
        ])
        setEmployerDetail(employerRes)
        setJobsOfEmployer(jobsRes)
      } catch (error) {
        console.error('Error fetching employer or jobs data:', error)
      }
    }
    fetchData()
  }, [id])

  const avatarBase64 = employerDetail.account?.avatar?.data
  const avatarSrc = avatarBase64
    ? `data:image/png;base64,${avatarBase64}`
    : '/default-avatar.png'

  return (
    <>
      <div className="container-responsive">
        <div className="flex justify-between w-full bg-gradient-blue-right py-10 rounded-medium px-25">
          <div className="flex justify-center items-center gap-5">
            <img
              src={avatarSrc}
              alt="imgcompany"
              className="object-cover w-40 h-40 rounded-small border-2 border-white-bright"
            />
            <div className="text-white flex flex-col items-start gap-5">
              <h6 className="text-3xl font-semibold">
                {employerDetail.companyName}
              </h6>
              <div className="flex gap-5">
                <div className="flex items-center">
                  <MapPinIcon className="w-6 h-6 mr-[6px] text-gray" />
                  <p>{employerDetail.address}</p>
                </div>
                <div className="flex items-center">
                  <BriefcaseIcon className="w-6 h-6 mr-[6px] text-gray" />
                  <p>{jobsOfEmployer.length} việc làm đang tuyển dụng</p>
                </div>
              </div>
              <a
                href="#current-job"
                className="group/b flex items-center justify-center bg-blue text-white rounded-full py-2 pl-3 pr-2 font-semibold gap-2.5 hover:bg-yellow hover:text-black transition-all duration-500 ease-in-out"
              >
                Xem các vị trí đang tuyển
                <div className="bg-white group-hover/b:bg-black rounded-full flex items-center justify-center w-[30px] h-[30px] transition-all duration-500 ease-in-out">
                  <ArrowUpRightIcon className="w-5 h-5 text-blue font-semibold group-hover/b:text-white transition-all duration-500 ease-in-out" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-20">
        <div className="container-responsive">
          <div className="grid grid-cols-[1fr_0.5fr] gap-10">
            <div className="flex flex-col gap-10">
              <div className="bg-white-bright p-10 rounded-medium">
                <h5 className="text-[22px] font-semibold pb-5 border-b border-gray-light">
                  Giới thiệu công ty
                </h5>
                <p className="mt-5">{employerDetail.companyInfo}</p>
              </div>

              <div
                id="current-job"
                className="bg-white-bright p-10 rounded-medium flex flex-col gap-5"
              >
                <h5 className="text-[22px] font-semibold pb-5 border-b border-gray-light">
                  Tuyển dụng
                </h5>
                {jobsOfEmployer.map((job, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 p-6 rounded-medium border border-white-low flex items-center justify-between hover:shadow-md hover:border-blue transition-all duration-300"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="w-[70px] h-[70px] bg-white-bright border border-white-low rounded-small flex justify-center items-center">
                        <img
                          src={avatarSrc}
                          alt="imgcompany"
                          className="object-cover w-10 h-10 rounded-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[22px]">
                          {job.title}
                        </h3>
                        <p className="text-black-low mt-2.5">
                          {job.profile?.companyName}
                        </p>
                        <div className="flex items-center text-black-low space-x-2 mt-2.5">
                          <span className="flex gap-2 items-center">
                            <CurrencyDollarIcon className="text-blue w-6 h-6" />
                            <p>{job.salary}</p>
                          </span>
                          <span>|</span>
                          <span className="flex gap-2 items-center">
                            <MapPinIcon className="text-blue w-6 h-6" />
                            <p>{job.location?.province}</p>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between h-full text-right gap-5">
                      <div className="text-sm bg-yellow px-2 py-1 rounded-lg">
                        {job.workType}
                      </div>
                      <div className="flex items-center space-x-3 justify-end">
                        <ButtonArrowOne
                          selectedPage={`/job-detail/${job._id}?openApply=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ứng tuyển
                        </ButtonArrowOne>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-visible">
              <div className="sticky top-[120px]">
                <div className="bg-white-bright p-10 rounded-medium">
                  <h5 className="text-[22px] font-semibold pb-5 border-b border-gray-light">
                    Thông tin chung
                  </h5>
                  <div className="flex flex-col gap-5 mt-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center">
                        <MapPinIcon className="w-5 h-5 mr-[6px] text-blue shrink-0" />
                        <p className="text-sm">
                          <span className="font-semibold mr-[6px]">
                            Địa chỉ công ty:
                          </span>
                          {employerDetail.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <TagIcon className="w-5 h-5 mr-[6px] text-blue" />
                      <span className="font-semibold mr-[6px]">Lĩnh vực: </span>
                      <p className="text-sm">{employerDetail.industry}</p>
                    </div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-5 h-5 mr-[6px] text-blue shrink-0" />
                      <span className="font-semibold mr-[6px]">Email: </span>
                      <p className="text-sm">{employerDetail.account.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EmployerDetail
