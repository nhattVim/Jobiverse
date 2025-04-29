import React from "react";
import Logo1 from "../assets/Logo1.svg";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex flex-col justify-start items-start w-[660px] p-[60px] gap-5 rounded-medium bg-white-mid my-6">
          <div className="flex justify-center items-center w-[100px] h-[100px] bg-white rounded-full">
            <img src={Logo1} alt="logo1" className="w-[68px]" />
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="text-3xl font-bold">Đăng ký tài khoản</h2>
            <p className="font-medium leading-6">
              Tạo tài khoản và bắt đầu sử dụng Jobiverse.
            </p>
          </div>

          <form action="/login" className="w-full">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-medium leading-6">
                  Tên
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Nhập tên của bạn"
                  className="w-full h-[50px] px-4 py-2 bg-white-bright rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-medium leading-6">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Nhập email của bạn"
                  className="w-full h-[50px] px-4 py-2 bg-white-bright rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="font-medium leading-6">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Nhập mật khẩu của bạn"
                  className="w-full h-[50px] px-4 py-2 bg-white-bright rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label name="account" className="font-medium leading-6">
                  Loại tài khoản
                </label>
                <select
                  name="account"
                  className="w-full h-[50px] px-4 py-2 bg-white-bright rounded-full focus:outline-none focus:ring-2 focus:ring-blue"
                >
                  <option value="">Chọn loại tài khoản</option>
                  <option value="employer">Nhà tuyển dụng</option>
                  <option value="jobseeker">Người tìm việc</option>
                </select>
              </div>
              <div className="flex items-center gap-2.5">
                <input type="checkbox" name="policy" id="policy" />
                <p className="font-medium leading-6">
                  Tôi đã đọc và đồng ý với các{" "}
                  <Link to="/register" className="text-blue underline">
                    Điều khoản & Điều kiện.
                  </Link>
                </p>
              </div>
              <button
                type="submit"
                className="w-full h-[50px] bg-blue text-white font-bold rounded-full hover:bg-blue-mid transition duration-300"
              >
                Đăng ký
              </button>
            </div>
          </form>

          <div className="flex justify-center items-center w-full">
            <p className="font-medium leading-6">
              Bạn đã có tài khoản?{" "}
              <Link to="/login" className="text-blue underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
