import React from 'react'
import BgNews from '../assets/BgNews.jpg'

const News = () => {
  return (
    <div className="w-full pb-30">
      <div className="container-responsive">
        <div className="relative h-[400px]">
          <div className="absolute left-0 right-[-62px] h-full">
            <img
              src={BgNews}
              alt="bgnews"
              className="object-cover w-full h-full rounded-bl-[40px] rounded-tl-[40px]"
            />
          </div>

          <div className="absolute top-[60px] right-[20px] h-full">
            <h5 className="text-[28px] leading-[36.4px] text-white mb-5">
              Bạn muốn cập nhật thông tin mới nhất?
            </h5>
            <form className="w-full">
              <div className="flex justify-between items-center gap-5">
                <input
                  type="email"
                  id="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  className="w-[400px] h-[50px] px-4 py-2 bg-white-bright rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  type="submit"
                  className="px-[30px] h-[50px] bg-yellow text-black font-semibold rounded-full hover:bg-yellow-400 transition duration-300 cursor-pointer"
                >
                  Đăng ký ngay!
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default News
