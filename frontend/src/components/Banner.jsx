import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'
import React from 'react'

const Banner = ({ searchQuery, setSearchQuery, onClick }) => {
  return (
    <div className="container-responsive">
      <div className="relative h-[240px] w-full">
        <div className="absolute inset-0 w-full h-full">
          <div className="flex flex-col items-center justify-center h-full gap-5 bg-gradient-blue-right px-25 rounded-medium">
            <h5 className="text-[28px] font-semibold leading-[36.4px] text-white">
              Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc.
            </h5>
            <div className="w-full grid grid-cols-[0.5fr_1fr_0.25fr] bg-white rounded-full font-medium p-2">
              <div className="flex items-center justify-center p-5 ">
                <MapPinIcon className="w-6 h-6 text-black-low" />
                <select name="address" id="address" className="flex-1 bg-white focus:outline-none" defaultValue="">
                  <option value="" disabled hidden>
                    Địa điểm
                  </option>
                  <option value="hanoi">Hà Nội</option>
                  <option value="hcm">Hồ Chí Minh</option>
                  <option value="danang">Đà Nẵng</option>
                </select>
              </div>
              <div className="flex items-center justify-center gap-2 p-5 border-l border-l-gray-dark">
                <MagnifyingGlassIcon className="w-6 h-6 text-black-low" />
                <input
                  name="search"
                  id="search"
                  placeholder="Tìm kiếm việc làm"
                  className="flex-1 border-none outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      onClick?.()
                    }
                  }}
                />
              </div>
              <div className="flex justify-end pl-5 border-l border-l-gray-dark">
                <button
                  className="w-full bg-blue text-white rounded-full py-4 px-[30px] font-semibold hover:bg-blue-mid transition-all duration-300 ease-in-out cursor-pointer"
                  onClick={() => onClick?.()}
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
