import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import React from "react";

const Banner = () => {
  return (
    <div className="container-responsive">
      <div className="relative h-[240px] w-full">
        <div className="absolute inset-0 h-full w-full">
          <div className="flex flex-col justify-center items-center h-full bg-gradient-blue-right gap-5 px-25 rounded-medium">
            <h5 className="text-[28px] font-semibold leading-[36.4px] text-white">
              Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc.
            </h5>
            <div className="w-full grid grid-cols-[0.5fr_1fr_0.25fr] bg-white rounded-full font-medium p-2">
              <div className="flex justify-center items-center p-5 ">
                <MapPinIcon className="h-6 w-6 text-black-low" />
                <select name="address" id="address" className="bg-white flex-1">
                  <option value="" disabled selected hidden>
                    Địa điểm
                  </option>
                  <option value="hanoi">Hà Nội</option>
                  <option value="hcm">Hồ Chí Minh</option>
                  <option value="danang">Đà Nẵng</option>
                </select>
              </div>
              <div className="flex justify-center items-center p-5 gap-2 border-l border-l-gray-dark">
                <MagnifyingGlassIcon className="h-6 w-6 text-black-low" />
                <input
                  name="search"
                  id="search"
                  placeholder="Tìm kiếm việc làm"
                  className="flex-1 outline-none border-none"
                />
              </div>
              <div className="flex justify-end border-l border-l-gray-dark pl-5">
                <button className="w-full bg-blue text-white rounded-full py-4 px-[30px] font-semibold hover:bg-blue-mid transition-all duration-300 ease-in-out">
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
