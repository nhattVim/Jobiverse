import React from 'react'
import { FaFacebook, FaLinkedin, FaYoutube, FaEnvelope } from 'react-icons/fa'
import { HiMapPin } from 'react-icons/hi2'
import { BiSolidPhoneCall } from 'react-icons/bi'
import BannerText from '../components/BannerText'

const Contact = () => {
  return (
    <>
      <BannerText title="Liên hệ với Jobiverse" caption="Bạn cần hỗ trợ? Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7!"/>
      <div className="w-full py-20">
        <main className="container-responsive">
          <div className="grid grid-cols-[1fr_1fr] gap-[60px] min-h-full">
            <div className="overflow-visible w-full ">
              <div className="flex flex-col gap-5 p-10 rounded-medium bg-white-mid min-h-full">
                <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">
                  Thông tin liên hệ
                </h2>
                <div className="space-y-10">
                  <div className="flex items-start gap-4">
                    <HiMapPin className="h-7 w-7 text-black flex-shrink-0 mt-1" />
                    <p className="text-gray-700 text-lg">
                      170 An Dương Vương, Nguyễn Văn Cừ, Quy Nhơn, Bình Định
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <BiSolidPhoneCall className="h-7 w-7 text-black flex-shrink-0" />
                    <p className="text-gray-700 text-lg">0123456789</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <FaEnvelope className="h-6 w-6 text-black flex-shrink-0" />
                    <p className="text-gray-700 text-lg">Jobiverse@gmail.com</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <FaFacebook className="h-6 w-6 text-black flex-shrink-0" />
                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black text-lg hover:underline"
                    >
                      fb.com/jobiverse.vn
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <FaLinkedin className="h-7 w-7 text-black flex-shrink-0" />
                    <a
                      href="https://www.linkedin.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black text-lg hover:underline"
                    >
                      @jobiverse.vn
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <FaYoutube className="h-7 w-7 text-black flex-shrink-0" />
                    <a
                      href="https://www.youtube.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blackack text-lg hover:underline"
                    >
                      youtube.com/@Jobiverse
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-visible w-full">
              <div className="flex flex-col gap-5 p-10 rounded-medium bg-white-mid">
                <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">
                  Liên hệ trực tuyến
                </h2>
                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      className="w-full px-4 py-3 bg-white border border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 bg-white border border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      Tiêu đề
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-3 bg-white border border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      Nội dung
                    </label>
                    <textarea
                      id="message"
                      rows="6"
                      className="w-full px-4 py-3 bg-white border border-gray-400 rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button className=" bg-blue-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-500 transition duration-300">
                      Gửi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Contact
