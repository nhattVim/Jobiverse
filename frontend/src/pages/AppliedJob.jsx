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
import ButtonArrowOne from '../shared/ButtonArrowOne'
import UserContext from '../contexts/UserContext'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

const AppliedJob = () => {
  const { user } = useContext(UserContext)
  const [profile, setProfile] = useState({})
  const [appliedJobs, setAppliedJobs] = useState([])

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
        console.log(data)
        setAppliedJobs(data)
      } catch (err) {
        console.log('Error load applied jobs', err.message)
      }
    }

    loadAppliedJobs()
  }, [])

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
        <div className="flex-1 space-y-6">
          {appliedJobs.length === 0 ? (
            <div className="text-sm text-center text-gray-500">
              Bạn chưa ứng tuyển việc làm nào.
            </div>
          ) : (
            appliedJobs.map((job, index) => (
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
                      <span className="flex gap-2 items-center">
                        <CurrencyDollarIcon className="text-blue w-6 h-6" />
                        {job.salary}
                      </span>
                      <span>|</span>
                      <span className="flex gap-2 items-cente">
                        <MapPinIcon className="text-blue w-6 h-6" />
                        {job.location?.province}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between h-full text-right gap-5">
                  <p className="text-sm text-black-low">
                    Đã ứng tuyển:{' '}
                    {job.applicants.map((data) => (
                      <span key={data.student}>
                        {new Date(data.appliedAt).toLocaleDateString()}
                      </span>
                    ))}
                  </p>
                  <div className="flex items-center space-x-3 justify-end">
                    {(() => {
                      // Lấy applicant của user hiện tại
                      const applicant = job.applicants?.find(
                        (data) => data && data.student === profile._id
                      )
                      let status = applicant?.status
                      switch (status) {
                      case 'pending':
                        return (
                          <span className="flex items-center px-3 py-2 rounded-full bg-yellow-50 text-yellow-500 border border-yellow-500 font-medium">
                            <ClockIcon className="h-5 w-5 mr-1" />
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
                    })()}
                    <button
                      title="Huỷ ứng tuyển"
                      className="flex items-center justify-center px-3 py-2 rounded-full bg-red hover:bg-red-700 text-white transition duration-300 shadow-md cursor-pointer"
                    >
                      <span>Huỷ</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AppliedJob
