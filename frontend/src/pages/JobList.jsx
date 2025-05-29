import React, { useState, useEffect } from 'react'
import Banner from '../components/Banner'
import { CheckIcon, FunnelIcon } from '@heroicons/react/24/solid'
import JobListItem from '../components/JobListItem'
import apiFetch from '../services/api'

const JobList = () => {
  const [jobLists, setJobLists] = useState([])
  const [sortOption, setSortOption] = useState('default')
  const [majors, setMajors] = useState([])
  const [specs, setSpecs] = useState([])

  const [selectedMajors, setSelectedMajors] = useState([])
  const [selectedSpecs, setSelectedSpecs] = useState([])
  const [selectedExps, setSelectedExps] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])

  const [showAllMajors, setShowAllMajors] = useState(false)
  const [showAllSpecs, setShowAllSpecs] = useState(false)
  const [showAllExps, setShowAllExps] = useState(false)
  const [showAllTypes, setShowAllTypes] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [d1, d2, d3] = await Promise.all([
          apiFetch('/projects'),
          apiFetch('/majors', 'GET'),
          apiFetch('/specs', 'GET')
        ])
        console.log(d1)
        setJobLists(d1)
        setMajors(d2)
        setSpecs(d3)
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err)
      }
    }
    loadData()
  }, [])

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

  const handleCheckboxChange = (value, selectedValues, setSelectedValues) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value))
    } else {
      setSelectedValues([...selectedValues, value])
    }
  }

  const clearAllFilters = () => {
    setSelectedMajors([])
    setSelectedSpecs([])
    setSelectedExps([])
    setSelectedTypes([])
  }

  const getFilteredJobs = () => {
    let filteredJobs = [...jobLists]

    if (selectedMajors.length > 0) {
      if (selectedMajors.length > 0) {
        filteredJobs = filteredJobs.filter((job) => {
          const jobMajors = Array.isArray(job.major) ? job.major : [job.major]
          const jobMajorIds = jobMajors.map((m) => m?._id?.toString?.() ?? m.toString())
          return selectedMajors.every((selectedId) => jobMajorIds.includes(selectedId))
        })
      }
    }

    if (selectedSpecs.length > 0) {
      filteredJobs = filteredJobs.filter((job) => {
        const jobSpecs = Array.isArray(job.specialization) ? job.specialization : [job.specialization]
        const jobSpecIds = jobSpecs.map((s) => s?._id?.toString?.() ?? s.toString())
        return selectedSpecs.every((selectedId) => jobSpecIds.includes(selectedId))
      })
    }

    if (selectedExps.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        selectedExps.includes(job.experience)
      )
    }

    if (selectedTypes.length > 0) {
      filteredJobs = filteredJobs.filter((job) => {
        const typeId = jobTypeItem.find((type) => type.name.toLowerCase() === job.workType?.toLowerCase())?.id
        return selectedTypes.includes(typeId)
      })
    }

    if (sortOption === 'newest') {
      filteredJobs.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    } else if (sortOption === 'oldest') {
      filteredJobs.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      )
    } else if (sortOption === 'salary') {
      filteredJobs.sort((a, b) => b.salary - a.salary)
    } else if (sortOption === 'salary-low') {
      filteredJobs.sort((a, b) => a.salary - b.salary)
    }

    return filteredJobs
  }

  const renderCheckboxList = (
    items,
    selectedItems,
    setSelectedItems,
    showAll,
    setShowAll,
    label
  ) => {
    const numberOfItems = 3
    const displayItems = showAll ? items : items.slice(0, numberOfItems)

    const getId = (item) => item._id ?? item.id

    return (
      <div className="flex flex-col gap-2 px-2">
        <p className="mb-1 text-sm font-medium text-gray-700">{label}</p>
        {displayItems.map((item) => {
          const id = getId(item)
          return (
            <label key={id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedItems.includes(id)}
                onChange={() =>
                  handleCheckboxChange(
                    id,
                    selectedItems,
                    setSelectedItems
                  )
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-black-low">{item.name}</span>
            </label>
          )
        })}
        {items.length > numberOfItems && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-1 text-sm text-blue-500"
          >
            {showAll ? 'Thu gọn' : 'Xem thêm'}
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      <Banner />
      <div className="w-full py-30">
        <div className="container-responsive">
          <div className="grid grid-cols-[0.5fr_1fr] gap-[70px] min-h-full">
            {/* Sidebar */}
            <div className="relative overflow-visible">
              <div className="sticky top-[88px] flex flex-col gap-5 p-10 rounded-medium bg-white-mid">
                <div className="flex items-center gap-2.5">
                  <FunnelIcon className="w-10 h-10" />
                  <h6 className="text-[22px] font-semibold leading-0">
                    Lọc nâng cao
                  </h6>
                </div>

                {/* Filter by major */}
                {renderCheckboxList(
                  majors,
                  selectedMajors,
                  setSelectedMajors,
                  showAllMajors,
                  setShowAllMajors,
                  'Ngành (Major)'
                )}

                {/* Filter by spec */}
                {renderCheckboxList(
                  specs,
                  selectedSpecs,
                  setSelectedSpecs,
                  showAllSpecs,
                  setShowAllSpecs,
                  'Chuyên ngành (Specialization)'
                )}

                {/* Filter by experience */}
                {renderCheckboxList(
                  expItem,
                  selectedExps,
                  setSelectedExps,
                  showAllExps,
                  setShowAllExps,
                  'Kinh nghiệm'
                )}

                {/* Filter by job type */}
                {renderCheckboxList(
                  jobTypeItem,
                  selectedTypes,
                  setSelectedTypes,
                  showAllTypes,
                  setShowAllTypes,
                  'Hình thức làm việc'
                )}

                {/* Clear all filters */}
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 mt-4 text-white bg-red-500 rounded"
                >
                  Xoá tất cả bộ lọc
                </button>
              </div>
            </div>

            {/* Content */}
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
                      name="sort"
                      id="sort"
                      className="w-full focus:outline-none"
                      onChange={(e) => setSortOption(e.target.value)}
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

              {getFilteredJobs().map((item, index) => (
                <JobListItem key={index} job={item} a={majors} b={specs} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default JobList
