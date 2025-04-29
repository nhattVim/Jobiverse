import React from "react";
import Logo1 from "../assets/Logo1.svg";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex flex-col justify-start items-start w-[660px] p-[60px] gap-5 rounded-medium bg-white-mid">
        <div className="flex justify-center items-center w-[100px] h-[100px] bg-white rounded-full">
          <img src={Logo1} alt="logo1" className="w-[68px]" />
        </div>

        <div className="flex flex-col gap-2.5">
          <h2 className="text-3xl font-bold">Đăng nhập ở đây</h2>
          <p className="font-medium leading-6">
            Điền vào email và mật khẩu của bạn để đăng nhập.
          </p>
        </div>

        <form action="/" className="w-full">
          <div className="flex flex-col gap-5">
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
            <button
              type="submit"
              className="w-full h-[50px] bg-blue text-white font-bold rounded-full hover:bg-blue-mid transition duration-300"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        <div className="flex justify-between items-center w-full">
          <p className="font-medium leading-6">
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" className="text-blue underline">
              Đăng ký
            </Link>
          </p>
            <Link to="/" className="text-blue font-medium leading-6 underline">
              Quên mật khẩu?
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
