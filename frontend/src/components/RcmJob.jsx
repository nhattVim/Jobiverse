import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { ApplicationStatusContext } from '../contexts/ApplicationStatusContext'
import apiFetch from '../services/api'
import JobCard from '../components/JobCard'
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon
} from '@heroicons/react/24/solid'
import JobCardSkeleton from '../shared/loading/JobCardSkeleton'

const RcmJob = ({ id, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [projects, setProjects] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(UserContext)
  const { fetchAppliedStatus } = useContext(ApplicationStatusContext)

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    setCurrentIndex(isFirstSlide ? 0 : currentIndex - 1)
  }

  const goToNext = () => {
    const isLastSlide =
      projects.length > 3
        ? currentIndex === projects.length - 3
        : currentIndex === 0
    setCurrentIndex(isLastSlide ? 0 : currentIndex + 1)
  }

  useEffect(() => {
    const loadProjectsAndFavorites = async () => {
      try {
        const favoritesPromise = user
          ? apiFetch('/favorites', 'GET')
          : Promise.resolve([])

        const [projectsData, favoritesData] = await Promise.all([
          apiFetch(`/projects/rcm/${id}`, 'GET'),
          favoritesPromise
        ])

        setProjects(projectsData)
        setFavorites(
          Array.isArray(favoritesData)
            ? favoritesData
              .filter(
                (fav) =>
                  fav.project &&
                  fav.project._id &&
                  projectsData.some((proj) => proj._id === fav.project._id)
              )
              .map((fav) => fav.project._id)
            : []
        )
      } catch (error) {
        console.error('Error fetching projects:', error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAppliedStatus()
    loadProjectsAndFavorites()
  }, [user, fetchAppliedStatus, id])

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-start justify-between w-full mb-10">
        {title}
        {projects.length > 0 && (
          <div className="flex items-center gap-5">
            <ArrowLongLeftIcon
              className="w-10 h-10 text-black cursor-pointer"
              onClick={goToPrevious}
            />
            <ArrowLongRightIcon
              className="w-10 h-10 text-black cursor-pointer"
              onClick={goToNext}
            />
          </div>
        )}
      </div>

      <div className="w-full">
        {loading ? (
          <div className="h-full overflow-hidden whitespace-nowrap">
            <JobCardSkeleton jobCards={4}/>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            Hiện tại không có dự án tương tự
          </div>
        ) : (
          <div className="h-full overflow-hidden whitespace-nowrap">
            {projects.map((item, index) => (
              <JobCard
                key={index}
                job={item}
                currentIndex={currentIndex}
                isFavoritedInitially={favorites.includes(item._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RcmJob
