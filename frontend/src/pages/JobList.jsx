import React, { useState } from 'react'
import Banner from '../components/Banner'
import { CheckIcon, FunnelIcon } from '@heroicons/react/24/solid'
import JobListItem from '../components/JobListItem'

const JobList = () => {
  const categoriesItem = [
    { id: 1, name: 'Fullstack Developer' },
    { id: 2, name: 'Backend Developer' },
    { id: 3, name: 'Frontend Developer' },
    { id: 4, name: 'Mobile Developer' },
    { id: 5, name: 'Data Engineer' },
    { id: 6, name: 'Data Analyst' },
    { id: 7, name: 'DevOps Engineer' }
  ]
  const expItem = [
    { id: 1, name: 'Không yêu cầu' },
    { id: 2, name: 'Dưới 1 năm' },
    { id: 3, name: '1 năm' },
    { id: 4, name: '2 năm' },
    { id: 5, name: '3 năm' },
    { id: 6, name: '4 năm' },
    { id: 7, name: '5 năm' },
    { id: 8, name: 'Trên 5 năm' }
  ]
  const jobTypeItem = [
    { id: 1, name: 'Online' },
    { id: 2, name: 'Offline' }
  ]

  const jobItem = {
    jobTitle: 'Backend Developer (C#, .NET)',
    companyInfo: {
      img: 'https://cdn.prod.website-files.com/66b757e42412d2f5e0906c5f/66bf2b9a2ff5d8f19427f6db_job-07.svg',
      name: 'CodeLink',
      location: 'TP Hồ Chí Minh'
    },
    jobType: 'Thực tập',
    salary: 'Từ 2 - 4 triệu',
    location: 'TP Hồ Chí Minh',
    skill: ['C#', '.NET', 'SQL Server', 'REST API']
  }

  const jobItems = Array(4).fill(jobItem)
  const [selectedExp, setSelectedExp] = useState('Tất cả')
  const [selectedType, setSelectedType] = useState('Tất cả')

  const handleExpChange = (exp) => {
    setSelectedExp(exp)
  }

  const handleTypeChange = (type) => {
    setSelectedType(type)
  }
  return (
    <>
      <Banner />
      <div className="w-full py-30">
        <div className="container-responsive">
          <div className="grid grid-cols-[0.5fr_1fr] gap-[70px] min-h-full">
            <div className="overflow-visible">
              <div className="sticky top-[130px]">
                <div className="flex flex-col gap-5 p-10 rounded-medium bg-white-mid">
                  <div className="flex items-center gap-2.5">
                    <FunnelIcon className="h-10 w-10" />
                    <h6 className="text-[22px] font-semibold leading-0">
                      Lọc nâng cao
                    </h6>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p>Theo danh mục nghành</p>
                    <div className="grid grid-cols-2 gap-2.5 place-items-start">
                      {categoriesItem.map((item, index) => (
                        <div
                          key={index}
                          className="text-center py-1 px-2.5 border border-gray-dark rounded-full"
                        >
                          <p className="text-sm text-black-low">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p>Kinh nghiệm</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="exp"
                          id="exp"
                          className="w-[18px] h-[18px]"
                          checked={selectedType === 'Tất cả'}
                          onChange={() => handleTypeChange('Tất cả')}
                        />
                        <p className="text-sm text-black-low">Tất cả</p>
                      </div>
                      {expItem.map((item, index) => (
                        <div key={index} className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="exp"
                            id="exp"
                            className="w-[18px] h-[18px]"
                            checked={selectedType === item.name}
                            onChange={() => handleTypeChange(item.name)}
                          />
                          <p className="text-sm text-black-low">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p>Hình thức làm việc</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="type"
                          id="type"
                          className="w-[18px] h-[18px]"
                          checked={selectedExp === 'Tất cả'}
                          onChange={() => handleExpChange('Tất cả')}
                        />
                        <p className="text-sm text-black-low">Tất cả</p>
                      </div>
                      {jobTypeItem.map((item, index) => (
                        <div key={index} className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="type"
                            id="type"
                            className="w-[18px] h-[18px]"
                            checked={selectedExp === item.name}
                            onChange={() => handleExpChange(item.name)}
                          />
                          <p className="text-sm text-black-low">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[50px]">
              <div className="flex justify-center items-center bg-white-mid rounded-full py-5">
                <div className="flex items-center gap-5 px-5 border-r border-gray">
                  <p className="font-semibold">Tìm kiếm theo:</p>

                  <div className="text-center py-1 px-2.5 bg-blue rounded-full">
                    <p className="text-white">Tên việc làm</p>
                  </div>

                  <div className="text-center py-1 px-2.5 bg-blue rounded-full">
                    <p className="text-white">Tên công ty</p>
                  </div>

                  <div className="flex items-center text-center py-1 px-2.5 border border-blue-mid bg-white-bright rounded-full">
                    <CheckIcon className="h-5 w-5 text-blue-mid mr-1.5" />
                    <p className="text-blue-mid">Cả hai</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 px-5">
                  <p className="font-semibold">Sắp xếp theo:</p>

                  <div className="text-center py-1 px-2.5 bg-white-bright rounded-full">
                    <select
                      name="sort"
                      id="sort"
                      className="focus:outline-none w-full"
                    >
                      <option value="default">Mặc định</option>
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="salary">Lương cao nhất</option>
                      <option value="salary-low">Lương thấp nhất</option>
                    </select>
                  </div>
                </div>
              </div>

              {jobItems.map((item, index) => (
                <JobListItem
                  key={index}
                  jobTitle={item.jobTitle}
                  companyInfo={item.companyInfo}
                  jobType={item.jobType}
                  salary={item.salary}
                  location={item.location}
                  skill={item.skill}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default JobList
