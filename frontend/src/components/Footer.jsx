import React from 'react'
import Logo2 from '../assets/Logo2.svg'
import { PhoneIcon, EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

const Footer = () => {
  return (
    <div className="w-full pb-[30px]">
      <div className="container-responsive">
        <div className="flex flex-col items-start justify-center gap-[70px]">
          <div className="flex items-start gap-25 w-full">
            <div className="flex flex-col gap-5">
              <img src={Logo2} alt="logo2" className="h-[50px]"/>

              <div className="flex items-center gap-5 w-full">
                <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-dark">
                  <img src="https://cdn.prod.website-files.com/6493dcfff5da93a7486cd781/6494065c7b93029515381651_LinkedIn.svg" alt="facebook"/>
                </div>

                <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-dark">
                  <img src="https://cdn.prod.website-files.com/6493dcfff5da93a7486cd781/6494065ca7bebb1951d26d45_Facebook.svg" alt="facebook"/>
                </div>

                <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-dark">
                  <img src="https://cdn.prod.website-files.com/6493dcfff5da93a7486cd781/6494065c40a47641d73508d7_Youtube.svg" alt="facebook"/>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start w-full gap-9">
              <div className="w-full">
                <div className="flex items-center h-[50px]">
                  <h6 className="text-[22px] leading-[28.6px] font-semibold">Về Jobiverse</h6>
                </div>
                <ul className="flex flex-col gap-[15px] mt-5">
                  <li className="text-black-low">Trang chủ</li>
                  <li className="text-black-low">Giới thiệu</li>
                  <li className="text-black-low">Liên hệ</li>
                  <li className="text-black-low">Tuyển dụng</li>
                  <li className="text-black-low">Câu hỏi thường gặp</li>
                </ul>
              </div>

              <div className="w-full">
                <div className="flex items-center h-[50px]">
                  <h6 className="text-[22px] leading-[28.6px] font-semibold">Điều khoản chung</h6>
                </div>
                <ul className="flex flex-col gap-[15px] mt-5">
                  <li className="text-black-low">Chính sách bảo mật</li>
                  <li className="text-black-low">Quy chế hoạt động</li>
                  <li className="text-black-low">Giải quyết khiếu nại</li>
                  <li className="text-black-low">Thoả thuận sử dụng</li>
                </ul>
              </div>

              <div className="w-full">
                <div className="flex items-center h-[50px]">
                  <h6 className="text-[22px] leading-[28.6px] font-semibold">Xây dựng sự nghiệp</h6>
                </div>
                <ul className="flex flex-col gap-[15px] mt-5">
                  <li className="text-black-low">Việc làm tốt nhất</li>
                  <li className="text-black-low">Việc làm lương cao</li>
                  <li className="text-black-low">Việc làm quản lý</li>
                  <li className="text-black-low">Việc làm Senior</li>
                  <li className="text-black-low">Việc làm bán thời gian</li>
                </ul>
              </div>

              <div className="w-full">
                <div className="flex items-center h-[50px]">
                  <h6 className="text-[22px] leading-[28.6px] font-semibold">Liên hệ để đăng tin</h6>
                </div>
                <ul className="flex flex-col gap-[15px] mt-5">
                  <li className="flex items-center gap-2.5 text-black-low"><PhoneIcon className="w-6 h-6"/> (+84) 123 456 789</li>
                  <li className="flex items-center gap-2.5 text-black-low"><EnvelopeIcon className="w-6 h-6"/> Email: jobiverse@gmail.com</li>
                  <li className="flex items-center gap-2.5 text-black-low"><PaperAirplaneIcon className="w-6 h-6"/> Gửi thông tin liên hệ</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col jutify-center items-center gap-[30px] w-full">
            <div className="self-stretch w-full h-0 outline-2 outline-offset-[-1px] outline-gray-light"></div>
            <p className="text-black-low">© 2025 Jobiverse JSC. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
