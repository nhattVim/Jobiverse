/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Type1 from '../assets/Type1.jpg'
import Type2 from '../assets/Type2.jpg'
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Link, Route, useNavigate } from 'react-router-dom'
import {
  ArrowUpRightIcon,
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  IdentificationIcon,
  DocumentTextIcon
} from '@heroicons/react/24/solid'
import JobCard from '../components/JobCard'
import ButtonArrowOne from '../shared/ButtonArrowOne'
import { ROUTES } from '../routes/routePaths'
import apiFetch from '../services/api'
import { UserContext } from '../contexts/UserContext'
import { ApplicationStatusContext } from '../contexts/ApplicationStatusContext'
import JobCardSkeleton from '../shared/loading/JobCardSkeleton'

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [projects, setProjects] = useState([])
  const [favorites, setFavorites] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useContext(UserContext)
  const { fetchAppliedStatus } = useContext(ApplicationStatusContext)
  const navigate = useNavigate()
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)

  const heroImages = [
    'https://images.unsplash.com/photo-1699665235382-a6666f77a60e?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1714976326749-a51805fa9c20?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1675434301763-594b4d0c5819?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ]
  const heroDuration = 4000

  const setHeroIndex = (idx) => {
    setCurrentHeroIndex(idx)
  }

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
          apiFetch('/projects/latest', 'GET'),
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
  }, [user, fetchAppliedStatus])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, heroDuration)
    return () => {
      clearInterval(interval)
    }
  }, [currentHeroIndex, heroImages.length])

  return (
    <>
      {/* Hero Section */}
      <div className="container-responsive">
        <div className="grid grid-cols-[1fr_0.75fr] h-[571px] grid-rows-auto">
          <div className="relative">
            <div className="absolute inset-0 h-full -left-[70px] overflow-hidden flex items-stretch">
              <AnimatePresence initial={false}>
                <motion.img
                  key={currentHeroIndex}
                  src={heroImages[currentHeroIndex]}
                  className="object-cover w-full h-full absolute top-0 left-0"
                  alt="hero"
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  style={{ minWidth: '100%', minHeight: '100%' }}
                />
              </AnimatePresence>
              {/* Hero Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {heroImages.map((_, idx) => {
                  const isActive = currentHeroIndex === idx
                  return (
                    <button
                      key={idx}
                      className={`relative flex items-center justify-center overflow-hidden transition-all duration-300
                        w-8 h-1 rounded-full bg-white/40 hover:bg-white cursor-pointer outline-none`}
                      onClick={() => setHeroIndex(idx)}
                      aria-label={`Chuyển tới ảnh ${idx + 1}`}
                    >
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-0 h-full bg-white rounded-full z-50"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{
                            duration: heroDuration / 1000,
                            ease: 'linear'
                          }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-black-mid p-[60px] text-white rounded-br-medium rounded-tr-medium">
            <h1 className="text-[50px] font-semibold leading-[62.4px]">
              Kết nối công việc, tuyển dụng dễ dàng.
            </h1>

            <div className="flex flex-col gap-5">
              <h3 className="text-xl font-medium">
                Tìm công việc mơ ước của bạn
              </h3>

              <div className="grid grid-cols-[0.75fr_1fr] bg-black-low rounded-medium font-medium">
                <div className="flex items-center justify-center p-5 ">
                  <MapPinIcon className="w-6 h-6 text-yellow" />
                  <select
                    name="address"
                    id="address"
                    className="flex-1 cursor-pointer bg-black-low focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Địa điểm
                    </option>
                    <option value="hanoi">Hà Nội</option>
                    <option value="hcm">Hồ Chí Minh</option>
                    <option value="danang">Đà Nẵng</option>
                  </select>
                </div>

                <div className="flex items-center justify-center gap-2 p-5 border-l border-l-gray-dark">
                  <MagnifyingGlassIcon className="w-6 h-6 text-yellow" />
                  <input
                    name="search"
                    id="search"
                    value={query}
                    placeholder="Tìm kiếm việc làm"
                    className="flex-1 border-none outline-none"
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        navigate(`${ROUTES.JOB_LIST}?q=${query}`)
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container-responsive">
        <div className="flex items-center justify-between py-30">
          <div className="flex flex-col gap-10 items-start h-[300px]">
            <h2 className="text-5xl font-semibold leading-[62.4px]">
              Khám phá việc làm theo loại
            </h2>
            <Link
              to={ROUTES.JOB_LIST}
              className="group flex items-center justify-center bg-yellow text-black rounded-full py-2 pl-3 pr-2 font-semibold gap-2.5 hover:bg-blue hover:text-white transition-all duration-500 ease-in-out"
            >
              Xem tất cả
              <div className="bg-black rounded-full flex items-center justify-center w-[30px] h-[30px] group-hover:bg-white transition-all duration-500 ease-in-out">
                <ArrowUpRightIcon className="w-5 h-5 font-semibold text-white transition-all duration-500 ease-in-out group-hover:text-blue" />
              </div>
            </Link>
          </div>
          <div className="flex justify-end items-center gap-[50px] w-full">
            <div
              className="group relative p-[50px] w-[400px] h-[300px] shadow-lg flex items-end rounded-medium cursor-pointer"
              onClick={() => navigate(`${ROUTES.JOB_LIST}?workTypes=1`)}
            >
              <div className="absolute inset-0 bg-[#000] opacity-60 z-10 group-hover:opacity-20 transition-opacity ease-out duration-500 rounded-medium"></div>
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={Type1}
                  alt="type1"
                  className="object-cover w-full h-full rounded-medium"
                />
              </div>
              <div className="flex justify-between items-center w-[75%] absolute z-20">
                <h3 className="text-[28px] font-semibold text-white">Online</h3>
                <div className="bg-yellow rounded-full flex items-center justify-center w-[40px] h-[40px]">
                  <ArrowUpRightIcon className="w-6 h-6 font-semibold text-black" />
                </div>
              </div>
            </div>
            <div
              className="group relative p-[50px] w-[400px] h-[300px] shadow-lg flex items-end rounded-medium cursor-pointer"
              onClick={() => navigate(`${ROUTES.JOB_LIST}?workTypes=2`)}
            >
              <div className="absolute inset-0 bg-[#000] opacity-60 z-20 group-hover:opacity-20 transition-opacity ease-out duration-500 rounded-medium"></div>
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={Type2}
                  alt="type2"
                  className="object-cover w-full h-full rounded-medium"
                />
              </div>
              <div className="flex justify-between items-center w-[75%] absolute z-20">
                <h3 className="text-[28px] font-semibold text-white">
                  Offline
                </h3>
                <div className="bg-yellow rounded-full flex items-center justify-center w-[40px] h-[40px]">
                  <ArrowUpRightIcon className="w-6 h-6 font-semibold text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job List Section */}
      <div className="w-full bg-white-low py-30">
        <div className="container-responsive">
          <div className="flex flex-col items-start">
            <div className="flex justify-between items-start w-full mb-[60px]">
              <h2 className="text-5xl font-semibold leading-[62.4px]">
                Việc làm tốt nhất
              </h2>
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
            </div>
            <div className="w-full">
              <div className="h-full overflow-hidden whitespace-nowrap">
                {loading && <JobCardSkeleton jobCards={4} />}
                {projects.map((item, index) => (
                  <JobCard
                    key={index}
                    job={item}
                    currentIndex={currentIndex}
                    isFavoritedInitially={favorites.includes(item._id)}
                    loading={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advice Section */}
      <div className="w-full py-30">
        <div className="container-responsive">
          <div className="flex flex-col items-start">
            <h2 className="text-5xl font-semibold leading-[62.4px] mb-[60px]">
              Bức phá cùng Jobiverse
            </h2>

            <div className="grid grid-cols-2 gap-[50px]">
              <div className="flex items-center bg-white-low rounded-medium p-[30px] gap-[30px]">
                <div className="flex flex-col items-start">
                  <h6 className="text-[22px] leading-[28.6px] font-semibold mb-2.5">
                    Nâng cấp Profile
                  </h6>

                  <p className="mb-5 text-sm text-gray-dark">
                    Profile là bản hồ sơ năng lực giúp bạn xây dựng thương hiệu
                    cá nhân, thể hiện thế mạnh của bản thân thông qua việc đính
                    kèm học vấn, kinh nghiệm, dự án, kỹ năng,... của mình
                  </p>
                  <ButtonArrowOne
                    onClick={() =>
                      navigate(
                        user.role === 'employer'
                          ? ROUTES.EMPLOYER_PROFILE
                          : ROUTES.STUDENT_PROFILE
                      )
                    }
                  >
                    Tạo profile
                  </ButtonArrowOne>
                </div>

                <div>
                  <IdentificationIcon className="w-[100px] h-[100px] text-blue" />
                </div>
              </div>

              <div className="flex items-center bg-white-low rounded-medium p-[30px] gap-[30px]">
                <div className="flex flex-col items-start h-full">
                  <h6 className="text-[22px] leading-[28.6px] font-semibold mb-2.5">
                    CV Builder 2.0
                  </h6>

                  <p className="flex-1 mb-5 text-sm text-gray-dark">
                    Một chiếc CV chuyên nghiệp sẽ giúp bạn gây ấn tượng với nhà
                    tuyển dụng và tăng khả năng vượt qua vòng lọc CV.
                  </p>
                  <ButtonArrowOne selectedPage={ROUTES.CREATE_CV}>
                    Tạo CV ngay
                  </ButtonArrowOne>
                </div>

                <div>
                  <DocumentTextIcon className="w-[100px] h-[100px] text-blue" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Section */}
      <div className="w-full pb-30">
        <div className="container-responsive">
          <div className="grid grid-cols-[0.5fr_1fr] gap-[80px]">
            <div className="w-full">
              <img
                src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c3d/66beec0fa4c957f1ce611980_about-01.avif"
                alt="stepimg"
                className="object-cover w-full h-full rounded-medium"
              />
            </div>

            <div className="flex flex-col items-start justify-between w-full h-full">
              <div className="flex flex-col items-start gap-10">
                <p className="text-[24px] leading-9">
                  Nền tảng của chúng tôi cung cấp trải nghiệm liền mạch cho cả
                  người tìm kiếm việc làm và nhà tuyển dụng, sử dụng công nghệ
                  tiên tiến và giao diện thân thiện với người dùng để làm cho
                  quy trình tuyển dụng trở nên hiệu quả và hiệu suất.
                </p>

                <ButtonArrowOne selectedPage={ROUTES.CONTACT}>
                  Liên hệ ngay
                </ButtonArrowOne>
              </div>

              <div className="self-stretch relative inline-flex justify-start items-center gap-[50px]">
                <div className="inline-flex flex-col items-start self-stretch justify-start flex-1 gap-7">
                  <div className="w-12 h-12 p-2.5 bg-white-low rounded-[50px] flex flex-col justify-between items-center">
                    <div className="justify-start text-lg font-semibold ">
                      01
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                    <div className="self-stretch justify-start text-xl font-bold leading-7">
                      Tạo hồ sơ của bạn
                    </div>
                    <div className="justify-start w-48 text-base font-medium leading-normal text-gray-dark">
                      Đăng ký và xây dựng một hồ sơ toàn diện.
                    </div>
                  </div>
                </div>
                <div className="inline-flex flex-col items-start self-stretch justify-start flex-1 gap-7">
                  <div className="w-12 h-12 p-2.5 bg-blue rounded-[50px] flex flex-col justify-between items-center">
                    <div className="justify-start text-lg font-semibold text-white ">
                      02
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                    <div className="self-stretch justify-start text-xl font-bold leading-7">
                      Tìm kiếm và ứng tuyển
                    </div>
                    <div className="self-stretch justify-start text-base font-medium leading-normal text-gray-dark">
                      Duyệt qua hàng ngàn danh sách công việc trong các ngành
                      công nghiệp khác nhau.
                    </div>
                  </div>
                </div>
                <div className="inline-flex flex-col items-start self-stretch justify-start flex-1 gap-7">
                  <div className="w-12 h-12 p-2.5 bg-yellow rounded-[50px] flex flex-col justify-between items-center">
                    <div className="justify-start text-lg font-semibold">
                      03
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                    <div className="self-stretch justify-start text-xl font-bold leading-7">
                      Kết nối và được thuê
                    </div>
                    <div className="self-stretch justify-start text-base font-medium leading-normal text-gray-dark">
                      Nền tảng của chúng tôi tạo điều kiện cho giao tiếp liền
                      mạch để giúp bạn được thuê nhanh chóng.
                    </div>
                  </div>
                </div>
                <div className="w-[260px] h-0 left-[48px] top-[25px] absolute outline-2 outline-offset-[-1px] outline-white-low"></div>
                <div className="w-[260px] h-0 left-[359px] top-[25px] absolute outline-2 outline-offset-[-1px] outline-white-low"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
