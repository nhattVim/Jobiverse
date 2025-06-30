import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
import Banner from '../components/Banner'
import { CheckIcon, FunnelIcon } from '@heroicons/react/24/solid'
import JobListItem from '../components/JobListItem'
import apiFetch from '../services/api'
import { ApplicationStatusContext } from '../contexts/ApplicationStatusContext'
import { useSearchParams } from 'react-router-dom'
import JobListSkeleton from '../shared/loading/JobListSkeleton'

const expItem = [
  { id: 0, name: 'Không yêu cầu' },
  { id: 1, name: '1 năm' },
  { id: 2, name: '2 năm' },
  { id: 3, name: '3 năm' },
  { id: 4, name: '4 năm' },
  { id: 5, name: '5 năm' },
  { id: 6, name: 'Trên 5 năm' }
]

const jobTypeItem = [
  { id: 1, name: 'Online' },
  { id: 2, name: 'Offline' }
]

const PAGE_LIMIT = 10

const JobList = () => {
  const [searchParams] = useSearchParams()
  const { fetchAppliedStatus } = useContext(ApplicationStatusContext)

  // Data states
  const [jobs, setJobs] = useState([])
  const [majors, setMajors] = useState([])
  const [specs, setSpecs] = useState([])

  // Filter states
  const [selectedMajors, setSelectedMajors] = useState([])
  const [selectedSpecs, setSelectedSpecs] = useState([])
  const [selectedExps, setSelectedExps] = useState([])
  const [sortOption, setSortOption] = useState('default')

  const [searchQuery, setSearchQuery] = useState(!searchParams.get('q') ? '' : searchParams.get('q'))
  const [selectedTypes, setSelectedTypes] = useState(
    !searchParams.get('workTypes')
      ? [] : searchParams.get('workTypes').split(',').map((id) => parseInt(id, 10))
  )

  // UI states
  const [showAllMajors, setShowAllMajors] = useState(false)
  const [showAllSpecs, setShowAllSpecs] = useState(false)
  const [showAllExps, setShowAllExps] = useState(false)
  const [showAllTypes, setShowAllTypes] = useState(false)
  const [loading, setLoading] = useState(false)
  // Pagination states
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const observer = useRef()
  const jobListRef = useRef(null)

  const fetchInitialData = async () => {
    const [majors, specs] = await Promise.all([
      apiFetch('/majors'),
      apiFetch('/specs')
    ])
    setMajors(majors)
    setSpecs(specs)
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  // Reset page & jobs when filter/search changes
  useEffect(() => {
    setPage(1)
    setJobs([])
    setHasNextPage(true)
    if (jobListRef.current && ([selectedMajors, selectedSpecs, selectedExps, selectedTypes].some(arr => arr.length > 0))) {
      jobListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedMajors, selectedSpecs, selectedExps, selectedTypes, sortOption, searchQuery])

  // Build query string
  const buildQuery = useCallback(() => {
    const params = new URLSearchParams()
    if (selectedMajors.length) params.append('major', selectedMajors.join(','))
    if (selectedSpecs.length) params.append('spec', selectedSpecs.join(','))
    if (selectedExps.length) params.append('expRequired', selectedExps.join(','))
    if (searchQuery) params.append('search', searchQuery)
    if (selectedTypes.length) {
      const typeNames = selectedTypes.map((id) => jobTypeItem.find((t) => t.id === id)?.name).map(name => name.toLowerCase())
      params.append('workTypes', typeNames.join(','))
    }
    if (sortOption !== 'default') params.append('sortBy', sortOption)
    params.append('page', page)
    params.append('limit', PAGE_LIMIT)
    return params.toString()
  }, [selectedMajors, selectedSpecs, selectedExps, selectedTypes, sortOption, searchQuery, page])

  // Fetch jobs when page or filter changes
  useEffect(() => {
    let ignore = false
    const fetchJobs = async () => {
      if (page === 1) {
        setLoading(true)
        setJobs(null)
      } else setIsFetchingMore(true)
      try {
        const query = buildQuery()
        const res = await apiFetch(`/projects?${query}`)
        // Nếu backend trả về { data, pagination }
        const data = res.data || res
        const pagination = res.pagination || {}
        if (!ignore) {
          if (page === 1) setJobs(data)
          else setJobs(prev => [...(prev || []), ...data])
          setHasNextPage(pagination.hasNextPage !== undefined ? pagination.hasNextPage : (data.length === PAGE_LIMIT))
        }
      } catch (error) {
        if (!ignore) setHasNextPage(false)
        console.error('Error fetching jobs:', error)
      } finally {
        if (page === 1) setLoading(false)
        else setIsFetchingMore(false)
      }
    }
    fetchAppliedStatus()
    fetchJobs()
    return () => { ignore = true }
  }, [page, buildQuery, fetchAppliedStatus])

  // Infinite scroll handler
  const lastJobRef = useCallback(node => {
    if (loading || isFetchingMore || !hasNextPage) return
    if (observer.current) observer.current.disconnect()

    observer.current = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1)
        }
      }
    )
    if (node) observer.current.observe(node)

  }, [loading, isFetchingMore, hasNextPage])

  const handleCheckboxChange = (value, selected, setSelected) => {
    setSelected(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    )
  }

  const clearAllFilters = () => {
    setSelectedMajors([])
    setSelectedSpecs([])
    setSelectedExps([])
    setSelectedTypes([])
    setSearchQuery('')
    setSortOption('default')
    setPage(1)
    setJobs([])
    setHasNextPage(true)
  }

  const renderCheckboxList = (items, selected, setSelected, showAll, setShowAll, label, limit = 3) => {
    const visibleItems = showAll ? items : items.slice(0, limit)
    const getId = (item) => item._id ?? item.id

    return (
      <div className="">
        <p className="mb-2 text-sm font-semibold">{label}</p>
        <div className={`${limit != 3 ? 'grid grid-cols-2' : 'flex flex-col'} gap-2 px-2`}>
          {visibleItems.map((item) => {
            const id = getId(item)
            return (
              <label key={id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(id)}
                  onChange={() => handleCheckboxChange(id, selected, setSelected)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-black-low">{item.name}</span>
              </label>
            )
          })}
          {items.length > limit && limit === 3 && (
            <button onClick={() => setShowAll(!showAll)} className="mt-1 text-sm text-blue-500">
              {showAll ? 'Thu gọn' : 'Xem thêm'}
            </button>
          )}
        </div>
      </div>
    )
  }
  console.log(jobs)
  return (
    <>
      <Banner searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="w-full py-20">
        <div className="container-responsive">
          <div className="grid grid-cols-[0.5fr_1fr] gap-[70px] min-h-full">

            {/* Sidebar */}
            <div className="relative overflow-visible">
              <div className="sticky top-[124px] flex flex-col gap-5 p-10 rounded-medium bg-white-mid">
                <div className="flex items-center gap-2.5">
                  <FunnelIcon className="w-10 h-10" />
                  <h6 className="text-[22px] font-semibold leading-0">Lọc nâng cao</h6>
                </div>

                {renderCheckboxList(
                  majors,
                  selectedMajors,
                  setSelectedMajors,
                  showAllMajors,
                  setShowAllMajors,
                  'Ngành (Major)'
                )}

                <div className="h-[1px] w-full bg-gray-light"></div>

                {renderCheckboxList(
                  specs,
                  selectedSpecs,
                  setSelectedSpecs,
                  showAllSpecs,
                  setShowAllSpecs,
                  'Chuyên ngành (Specialization)'
                )}

                <div className="h-[0.5px] w-full bg-gray-light"></div>

                {renderCheckboxList(
                  expItem,
                  selectedExps,
                  setSelectedExps,
                  showAllExps,
                  setShowAllExps,
                  'Kinh nghiệm',
                  7
                )}

                <div className="h-[1px] w-full bg-gray-light"></div>

                {renderCheckboxList(
                  jobTypeItem,
                  selectedTypes,
                  setSelectedTypes,
                  showAllTypes,
                  setShowAllTypes,
                  'Hình thức làm việc',
                  2
                )}

                <button onClick={clearAllFilters} className="px-4 py-2 mt-4 text-white bg-red-500 rounded cursor-pointer hover:bg-red-600">
                  Xoá tất cả bộ lọc
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-[50px]" ref={jobListRef}>
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
                      value={sortOption}
                    >
                      <option value="default">Mặc định</option>
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="salaryDesc">Lương cao nhất</option>
                      <option value="salaryAsc">Lương thấp nhất</option>
                    </select>
                  </div>
                </div>
              </div>
              {loading || jobs === null ? (
                <JobListSkeleton jobList={10} />
              ) : (
                <>
                  {jobs.map((job, i) => {
                    if (i === jobs.length - 1) {
                      return (
                        <div ref={lastJobRef} key={i}>
                          <JobListItem job={job} a={majors} b={specs} />
                        </div>
                      )
                    }
                    return <JobListItem key={i} job={job} a={majors} b={specs} />
                  })}
                  {isFetchingMore && <JobListSkeleton jobList={2} />}
                  {jobs.length === 0 && (
                    <div className="py-10 text-center text-gray-500">Không có công việc nào phù hợp.</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default JobList
