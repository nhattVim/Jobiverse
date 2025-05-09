import React, { useEffect, useState } from 'react'
import HeroImg from '../assets/HeroImg.jpg'
import Type1 from '../assets/Type1.jpg'
import Type2 from '../assets/Type2.jpg'
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
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
import { fetchAllProjects } from '../services/api'

const Home = () => {
  const jobCard = {
    jobTitle: 'Backend Developer (C#, .NET)',
    imgCompany:
      'https://cdn.prod.website-files.com/66b757e42412d2f5e0906c5f/66bf2b9a2ff5d8f19427f6db_job-07.svg',
    jobType: 'Thực tập',
    salary: 'Từ 2 - 4 triệu',
    location: 'Hồ Chí Minh'
  }
  const jobCards = Array(9).fill(jobCard)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [projects, setProjects] = useState([])

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    setCurrentIndex(isFirstSlide ? 0 : currentIndex - 1)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === jobCards.length - 3
    setCurrentIndex(isLastSlide ? 0 : currentIndex + 1)
  }

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchAllProjects()
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error.message)
      }
    }

    loadProjects()
  }, [])

  return (
    <>
      <div className="container-responsive">
        {/* Hero Section */}
        <div className="grid grid-cols-[1fr_0.75fr] h-[571px] grid-rows-auto">
          <div className="relative">
            <div className="absolute inset-0 h-full -left-[60px]">
              <img
                src={HeroImg}
                alt="heroimg"
                className="object-cover w-full h-full"
              />
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
                <div className="flex justify-center items-center p-5 ">
                  <MapPinIcon className="h-6 w-6 text-yellow" />
                  <select
                    name="address"
                    id="address"
                    className="bg-black-low flex-1 focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled selected hidden>
                      Địa điểm
                    </option>
                    <option value="hanoi">Hà Nội</option>
                    <option value="hcm">Hồ Chí Minh</option>
                    <option value="danang">Đà Nẵng</option>
                  </select>
                </div>

                <div className="flex justify-center items-center p-5 gap-2 border-l border-l-gray-dark">
                  <MagnifyingGlassIcon className="h-6 w-6 text-yellow" />
                  <input
                    name="search"
                    id="search"
                    placeholder="Tìm kiếm việc làm"
                    className="flex-1 outline-none border-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container-responsive">
        <div className="flex justify-between items-center py-30">
          <div className="flex flex-col gap-10 items-start h-[300px]">
            <h2 className="text-5xl font-semibold leading-[62.4px]">
              Khám phá việc làm theo loại
            </h2>
            <Link to={ROUTES.JOB_LIST} className="group flex items-center justify-center bg-yellow text-black rounded-full py-2 pl-3 pr-2 font-semibold gap-2.5 hover:bg-blue hover:text-white transition-all duration-500 ease-in-out">
              Xem tất cả
              <div className="bg-black rounded-full flex items-center justify-center w-[30px] h-[30px] group-hover:bg-white transition-all duration-500 ease-in-out">
                <ArrowUpRightIcon className="w-5 h-5 text-white font-semibold group-hover:text-blue transition-all duration-500 ease-in-out" />
              </div>
            </Link>
          </div>
          <div className="flex justify-end items-center gap-[50px] w-full">
            <div className="relative p-[50px] w-[400px] h-[300px] shadow-lg flex items-end rounded-medium cursor-pointer">
              <div className="absolute inset-0 bg-[#000] opacity-60 z-30 hover:opacity-20 transition-opacity ease-out duration-500 rounded-medium"></div>
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={Type1}
                  alt="type1"
                  className="object-cover w-full h-full rounded-medium"
                />
              </div>
              <div className="flex justify-between items-center w-[75%] absolute z-40">
                <h3 className="text-[28px] font-semibold text-white">
                  Online
                </h3>
                <div className="bg-yellow rounded-full flex items-center justify-center w-[40px] h-[40px]">
                  <ArrowUpRightIcon className="w-6 h-6 text-black font-semibold" />
                </div>
              </div>
            </div>
            <div className="relative p-[50px] w-[400px] h-[300px] shadow-lg flex items-end rounded-medium cursor-pointer">
              <div className="absolute inset-0 bg-[#000] opacity-60 z-30 hover:opacity-20 transition-opacity ease-out duration-500 rounded-medium"></div>
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={Type2}
                  alt="type2"
                  className="object-cover w-full h-full rounded-medium"
                />
              </div>
              <div className="flex justify-between items-center w-[75%] absolute z-40">
                <h3 className="text-[28px] font-semibold text-white">
                  Offline
                </h3>
                <div className="bg-yellow rounded-full flex items-center justify-center w-[40px] h-[40px]">
                  <ArrowUpRightIcon className="w-6 h-6 text-black font-semibold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job List Section */}
      <div className="bg-white-low w-full py-30">
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
              <div className="whitespace-nowrap h-full overflow-hidden">
                {projects.map((job, index) => (
                  <JobCard
                    key={index}
                    jobTitle={job.title}
                    imgCompany={'https://cdn.prod.website-files.com/66b757e42412d2f5e0906c5f/66bf2b9a2ff5d8f19427f6db_job-07.svg'}
                    jobType={job.content}
                    salary={job.salary}
                    location={job.location}
                    currentIndex={currentIndex}
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

                  <p className="text-sm text-gray-dark mb-5">
                    Profile là bản hồ sơ năng lực giúp bạn xây dựng thương hiệu
                    cá nhân, thể hiện thế mạnh của bản thân thông qua việc đính
                    kèm học vấn, kinh nghiệm, dự án, kỹ năng,... của mình
                  </p>
                  <ButtonArrowOne selectedPage={ROUTES.HOME}>
                    Tạo profile
                  </ButtonArrowOne>
                </div>

                <div>
                  <IdentificationIcon className="w-[100px] h-[100px] text-blue" />
                </div>
              </div>

              <div className="flex items-center bg-white-low rounded-medium p-[30px] gap-[30px]">
                <div className="flex flex-col items-start">
                  <h6 className="text-[22px] leading-[28.6px] font-semibold mb-2.5">
                    CV Builder 2.0
                  </h6>

                  <p className="text-sm text-gray-dark mb-5">
                    Một chiếc CV chuyên nghiệp sẽ giúp bạn gây ấn tượng với nhà
                    tuyển dụng và tăng khả năng vượt qua vòng lọc CV.
                  </p>
                  <ButtonArrowOne selectedPage={ROUTES.HOME}>
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
                className="rounded-medium object-cover w-full h-full"
              />
            </div>

            <div className="flex flex-col justify-between items-start w-full h-full">
              <div className="flex flex-col items-start gap-10">
                <p className="text-[24px] leading-9">
                  Nền tảng của chúng tôi cung cấp trải nghiệm liền mạch cho cả
                  người tìm kiếm việc làm và nhà tuyển dụng, sử dụng công nghệ
                  tiên tiến và giao diện thân thiện với người dùng để làm cho
                  quy trình tuyển dụng trở nên hiệu quả và hiệu suất.
                </p>

                <ButtonArrowOne>Liên hệ ngay</ButtonArrowOne>
              </div>

              <div className="self-stretch relative inline-flex justify-start items-center gap-[50px]">
                <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-7">
                  <div className="w-12 h-12 p-2.5 bg-white-low rounded-[50px] flex flex-col justify-between items-center">
                    <div className="justify-start text-lg font-semibold ">
                      01
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                    <div className="self-stretch justify-start text-xl font-bold leading-7">
                      Tạo hồ sơ của bạn
                    </div>
                    <div className="w-48 justify-start text-gray-dark text-base font-medium leading-normal">
                      Đăng ký và xây dựng một hồ sơ toàn diện.
                    </div>
                  </div>
                </div>
                <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-7">
                  <div className="w-12 h-12 p-2.5 bg-blue rounded-[50px] flex flex-col justify-between items-center">
                    <div className="justify-start text-white text-lg font-semibold ">
                      02
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                    <div className="self-stretch justify-start text-xl font-bold leading-7">
                      Tìm kiếm và ứng tuyển
                    </div>
                    <div className="self-stretch justify-start text-gray-dark text-base font-medium leading-normal">
                      Duyệt qua hàng ngàn danh sách công việc trong các ngành
                      công nghiệp khác nhau.
                    </div>
                  </div>
                </div>
                <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-7">
                  <div className="w-12 h-12 p-2.5 bg-yellow rounded-[50px] flex flex-col justify-between items-center">
                    <div className="justify-start text-lg font-semibold">
                      03
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                    <div className="self-stretch justify-start text-xl font-bold leading-7">
                      Kết nối và được thuê
                    </div>
                    <div className="self-stretch justify-start text-gray-dark text-base font-medium leading-normal">
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
