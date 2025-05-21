import React, { useState, useEffect } from 'react'
import Banner from '../components/Banner'
import { CheckIcon, FunnelIcon } from '@heroicons/react/24/solid'
import JobListItem from '../components/JobListItem'
import apiFetch from '../services/api'

const JobList = () => {
  const [jobLists, setJobLists] = useState([])
  const [sortOption, setSortOption] = useState('default')

  useEffect(() => {
    const loadData = async () => {
      const data = await apiFetch('/projects')
      setJobLists(data)
    }
    loadData()
  }, [])

  const getSortedJobs = () => {
    if (!Array.isArray(jobLists) && !jobLists.length > 0) return
    const sortedJobs = [...jobLists]
    if (sortOption === 'newest') {
      sortedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortOption === 'oldest') {
      sortedJobs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortOption === 'salary') {
      sortedJobs.sort((a, b) => b.salary - a.salary)
    } else if (sortOption === 'salary-low') {
      sortedJobs.sort((a, b) => a.salary - b.salary)
    }
    return sortedJobs
  }

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
                    <FunnelIcon className="w-10 h-10" />
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
              <div className="flex items-center justify-center py-5 rounded-full bg-white-mid">
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
                      name="sort" id="sort" className="w-full focus:outline-none"
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="">Mặc định</option>
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="salary">Lương cao nhất</option>
                      <option value="salary-low">Lương thấp nhất</option>
                    </select>
                  </div>
                </div>
              </div>

              {getSortedJobs().map((item, index) => (
                <JobListItem
                  key={index}
                  job={item}
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
