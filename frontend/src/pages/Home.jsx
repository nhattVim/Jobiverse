import React, { useState } from "react";
import HeroImg from "../assets/HeroImg.jpg";
import Type1 from "../assets/Type1.jpg";
import Type2 from "../assets/Type2.jpg";
import { MapPinIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import {
  ArrowUpRightIcon,
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/24/solid";
import JobCard from "../components/JobCard";

const Home = () => {
  const jobCard = {
    jobTitle: "Backend Developer (C#, .NET)",
    imgCompany:
      "https://cdn.prod.website-files.com/66b757e42412d2f5e0906c5f/66bf2b9a2ff5d8f19427f6db_job-07.svg",
    jobType: "Thực tập",
    salary: "Từ 2 - 4 triệu",
    location: "Hồ Chí Minh",
  };
  const jobCards = Array(9).fill(jobCard);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    setCurrentIndex(isFirstSlide ? 0 : currentIndex - 1);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === jobCards.length - 3;
    setCurrentIndex(isLastSlide ? 0 : currentIndex + 1);
  };

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
                    className="bg-black-low flex-1"
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
            <Link className="flex items-center justify-center bg-yellow text-black rounded-full py-2 pl-3 pr-2 font-semibold gap-2.5">
              Xem tất cả
              <div className="bg-black rounded-full flex items-center justify-center w-[30px] h-[30px]">
                <ArrowUpRightIcon className="w-5 h-5 text-white font-semibold" />
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
                  Bán thời gian
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
                  Toàn thời gian
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
        <div className="container-responsive relative">
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
                {jobCards.map((job, index) => (
                  <JobCard
                    key={index}
                    jobTitle={job.jobTitle}
                    imgCompany={job.imgCompany}
                    jobType={job.jobType}
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
    </>
  );
};

export default Home;
