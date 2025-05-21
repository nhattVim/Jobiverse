import { useState, useMemo, useEffect } from 'react'
import { MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import apiFetch from '../services/api'

const JobListItem = ({ job }) => {
  const [majors, setMajors] = useState([])
  const [specs, setSpecs] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const majorData = await apiFetch('/majors', 'GET')
      const specData = await apiFetch('/specs', 'GET')
      setMajors(majorData)
      setSpecs(specData)
    }
    fetchData()
  }, [])

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
          <div className="flex items-center gap-5">
            <div className="w-[70px] h-[70px] bg-white border border-white-low rounded-small flex justify-center items-center">
              <img
                src={`data:image/png;base64,${job.account?.avatar?.data}`}
                alt="imgcompany"
                className="object-cover w-10 h-10 rounded-full"
              />
            </div>

            <div className="flex flex-col justify-center gap-1">
              <h6 className="text-[22px] font-semibold leading-[28.6px]">
                {job.title}
              </h6>
              <p>{job.description}</p>
            </div>
          </div>

          <div className="px-2 py-1 bg-yellow rounded-[5px]">{job.workType}</div>
        </div>

        <h6 className="text-[22px] font-semibold leading-[28.6px]">
          {job.content}
        </h6>

        <div className="flex flex-col gap-3">
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-6 h-6 text-blue mr-[6px]" />
            <p className="text-black-low">{job.salary}</p>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="w-6 h-6 text-blue mr-[6px]" />
            <p className="text-black-low">{job.location}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex flex-wrap w-4/5 gap-2">
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

        <ButtonArrowOne selectedPage="/">Ứng tuyển</ButtonArrowOne>
      </div>
    </div>
  )
}

export default JobListItem
