/* eslint-disable indent */
import { useState, useMemo, useEffect, useContext } from 'react'
import {
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  InboxArrowDownIcon
} from '@heroicons/react/24/outline'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import { Link } from 'react-router-dom'
import { ApplicationStatusContext } from '../contexts/ApplicationStatusContext'
import { UserContext } from '../contexts/UserContext'

const JobListItem = ({ job, a, b }) => {
  const [majors, setMajors] = useState([])
  const [specs, setSpecs] = useState([])
  const { statusMap } = useContext(ApplicationStatusContext)
  const { user } = useContext(UserContext)
  const applicantStatus = statusMap[job._id]?.status

  const isOwner = job?.account?._id === user?._id

  useEffect(() => {
    setMajors(a)
    setSpecs(b)
  }, [a, b])

  const majorMap = useMemo(() => {
    const map = {}
    majors.forEach((m) => {
      map[m._id] = m.name
    })
    return map
  }, [majors])

  const specializationMap = useMemo(() => {
    const map = {}
    specs.forEach((s) => {
      map[s._id] = s.name
    })
    return map
  }, [specs])

  const TagList = ({ ids = [], map, className }) => {
    return ids
      .filter((id, index, self) => map[id] && self.indexOf(id) === index)
      .map((id) => (
        <div
          key={id}
          className={`text-center py-1 px-2.5 border rounded-full ${className}`}
        >
          <p className="text-sm text-black-low">{map[id]}</p>
        </div>
      ))
  }

  return (
    <div className="flex flex-col items-start gap-[30px] p-10 bg-white-mid rounded-medium w-full">
      <div className="flex flex-col items-start gap-5 w-full pb-[15px] border-b border-b-gray-light">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center w-full gap-5">
            <div className="w-[60px] h-[60px] bg-white-bright border border-white-low rounded-small flex justify-center items-center shrink-0">
              <img
                src={`data:image/png;base64,${job.account?.avatar?.data}`}
                alt="imgcompany"
                className="object-cover w-10 h-10 rounded-full"
              />
            </div>

            <div className="flex flex-col justify-center w-full gap-1">
              <Link
                to={`/job-detail/${job._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[22px] font-semibold leading-[28.6px] line-clamp-1 hover:text-blue transition-colors duration-300"
              >
                {job.title}
              </Link>
              <p className="text-[16px] font-normal leading-[21px] text-black-low line-clamp-2 w-4/5">
                {job.account?.role === 'employer'
                  ? job.profile?.companyName
                  : job.profile?.name}
              </p>
            </div>
          </div>

          <div className="px-2 py-1  bg-yellow rounded-[5px] whitespace-nowrap">
            {job.workType}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-6 h-6 text-blue mr-[6px]" />
            <p className="text-black-low">{job.salary}</p>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="w-6 h-6 text-blue mr-[6px]" />
            <p className="text-black-low">
              {[
                job.location?.ward,
                job.location?.district,
                job.location?.province
              ]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex flex-wrap w-3/4 gap-2">
          <TagList
            ids={job.major}
            map={majorMap}
            className="h-8 text-blue-800 bg-blue-100 border-blue-500"
          />
          <TagList
            ids={job.specialization}
            map={specializationMap}
            className="h-8 text-green-800 bg-green-100 border-green-500"
          />
        </div>

        {isOwner ? (
          <ButtonArrowOne selectedPage={`/job/${job._id}`}>
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
                    icon={<ClockIcon className="w-5 h-5 mr-1" />}
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
                    className="text-red-500 border border-red-500 rounded-full bg-red-50"
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
                return (
                  <ButtonArrowOne
                    selectedPage={`/job-detail/${job._id}?openApply=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ứng tuyển
                  </ButtonArrowOne>
                )
            }
          })()
        ) : (
          <ButtonArrowOne
            selectedPage={`/job-detail/${job._id}?openApply=true`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ứng tuyển
          </ButtonArrowOne>
        )}
      </div>
    </div>
  )
}

const StatusTag = ({ icon, content, className }) => {
  return (
    <span
      className={`flex items-center h-[46px] px-3 font-medium ${className}`}
    >
      {icon}
      {content}
    </span>
  )
}

export default JobListItem
