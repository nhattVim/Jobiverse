/* eslint-disable indent */
import React, { useEffect, useState } from 'react'
import apiFetch from '../services/api'
import BannerText from '../components/BannerText'
import Sidebar from '../components/Sidebar'
import {
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { UserContext } from '../contexts/UserContext'
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApplicationStatusContext } from '../contexts/ApplicationStatusContext'
import { formatDateTime } from '../utils/dateTimeUtils'

const AppliedJob = () => {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [profile, setProfile] = useState({})
  const [appliedJobs, setAppliedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const { fetchAppliedStatus } = useContext(ApplicationStatusContext)

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
    const loadAppliedJobs = async () => {
      try {
        const data = await apiFetch('/projects/applied', 'GET')
        setAppliedJobs(data)
      } catch (err) {
        console.log('Error load applied jobs', err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAppliedJobs()
  }, [])

  const handleDeleteApplied = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn huỷ ứng tuyển công việc này?'))
      return

    try {
      await apiFetch(`/projects/applied/${id}`, 'DELETE')
      setAppliedJobs((prevJobs) => prevJobs.filter((job) => job._id !== id))

      fetchAppliedStatus()
    } catch (err) {
      console.log('Cannot delete applied job', err.message)
    }
  }

  return (
    <div className="relative min-h-screen">
      <BannerText
        title="Việc làm đã ứng tuyển"
        caption="Xem lại danh sách những việc làm mà bạn đã lưu trước đó. Ứng tuyển ngay để không bỏ lỡ cơ hội nghề nghiệp dành cho bạn."
      />

      <div className="flex items-start gap-16 px-6 py-20 mx-auto max-w-7xl">
        <div className="flex-shrink-0 w-1/4">
          <Sidebar />
        </div>
        {loading ? (
          <div className="flex items-center justify-center w-full h-60">
            <p className="text-lg text-gray-500">Đang tải việc làm...</p>
          </div>
        ) : (
          <div className="flex-1 space-y-6">
            {appliedJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-5 py-6 bg-white-low rounded-medium">
                <h2 className="w-full pl-6 text-xl font-semibold text-left">
                  Việc làm đã ứng tuyển
                </h2>
                <img
                  src="https://cdn-icons-png.freepik.com/256/10488/10488851.png?uid=P110270408&ga=GA1.1.1066839565.1745722550&semt=ais_incoming"
                  alt="job"
                  className="w-20"
                />
                <p className="text-center text-gray-500">
                  Bạn chưa ứng tuyển việc làm nào
                </p>
                <button
                  onClick={() => navigate('/job-list')}
                  className="px-5 py-2 text-sm text-white rounded-full cursor-pointer bg-blue hover:bg-blue-700"
                >
                  Tìm việc ngay
                </button>
              </div>
            ) : (
              appliedJobs.map((job, index) => {
                const applicant = job.applicants?.find(
                  (data) => data && data.student === profile._id
                )
                if (applicant?.status === 'invited') return null
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-6 transition shadow bg-white-mid rounded-medium hover:shadow-md"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="w-[70px] h-[70px] bg-white border border-white-low rounded-small flex justify-center items-center">
                        <img
                          src={`data:image/png;base64,${job.account?.avatar?.data}`}
                          alt="imgcompany"
                          className="object-cover w-10 h-10 rounded-full"
                        />
                      </div>
                      <div>
                        <Link
                          to={`/job-detail/${job._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[22px] font-semibold leading-[28.6px] line-clamp-1 hover:text-blue transition-colors duration-300"
                        >
                          {job.title}
                        </Link>
                        <p className="text-black-low mt-2.5">
                          {job.profile?.name || job.profile?.companyName}
                        </p>
                        <div className="flex items-center text-black-low space-x-2 mt-2.5">
                          <span className="flex items-center gap-2">
                            <CurrencyDollarIcon className="w-6 h-6 text-blue" />
                            {job.salary}
                          </span>
                          <span>|</span>
                          <span className="flex gap-2 items-cente">
                            <MapPinIcon className="w-6 h-6 text-blue" />
                            {job.location?.province}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between h-full gap-8 text-right">
                      <p className="text-sm text-black-low">
                        Đã ứng tuyển:{' '}
                        {applicant && (
                          <span>{formatDateTime(applicant.appliedAt)}</span>
                        )}
                      </p>
                      <div className="flex items-center justify-end space-x-3">
                        {(() => {
                          let status = applicant?.status
                          switch (status) {
                            case 'pending':
                              return (
                                <div className="flex items-center justify-end space-x-3">
                                  <StatusTag
                                    icon={
                                      <ClockIcon className="w-5 h-5 mr-1" />
                                    }
                                    content="Đang chờ duyệt"
                                    className="text-yellow-500 border border-yellow-500 rounded-full bg-yellow-50"
                                  />
                                  <button
                                    title="Huỷ ứng tuyển"
                                    className="flex items-center justify-center px-3 py-2 text-white transition duration-300 rounded-full shadow-md cursor-pointer bg-red hover:bg-red-700"
                                    onClick={() => handleDeleteApplied(job._id)}
                                  >
                                    <span>Huỷ</span>
                                  </button>
                                </div>
                              )
                            case 'accepted':
                              return (
                                <StatusTag
                                  icon={
                                    <CheckCircleIcon className="w-5 h-5 mr-1" />
                                  }
                                  content="Đã duyệt"
                                  className="text-green-500 border border-green-500 rounded-full bg-green-50"
                                />
                              )
                            case 'rejected':
                              return (
                                <div className="flex items-center justify-end space-x-3">
                                  <StatusTag
                                    icon={
                                      <XCircleIcon className="w-5 h-5 mr-1" />
                                    }
                                    content="Bị từ chối"
                                    className="text-red-500 border border-red-500 rounded-full bg-red-50"
                                  />
                                  <button
                                    title="Huỷ ứng tuyển"
                                    className="flex items-center justify-center px-3 py-2 text-white transition duration-300 rounded-full shadow-md cursor-pointer bg-red hover:bg-red-700"
                                    onClick={() => handleDeleteApplied(job._id)}
                                  >
                                    <span>Huỷ</span>
                                  </button>
                                </div>
                              )
                            default:
                              return null
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const StatusTag = ({ icon, content, className }) => {
  return (
    <span className={`flex items-center px-3 py-2 font-medium ${className}`}>
      {icon}
      {content}
    </span>
  )
}
export default AppliedJob
