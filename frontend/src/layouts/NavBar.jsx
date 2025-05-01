import React from "react";
import Logo2 from "../assets/Logo2.svg";
import { Link } from "react-router-dom";
import {
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import ButtonArrowOne from "../shared/ButtonArrowOne";

const NavBar = () => {
  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-white py-5">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-[64px]">
          <div>
            <img src={Logo2} alt="logo2" className="h-10" />
          </div>

          <div>
            <ul className="flex font-medium">
              <li className="px-5 py-2.5">
                <Link to={"/"}>Trang chủ</Link>
              </li>
              <li className="px-5 py-2.5">
                <Link className="flex items-center" to={"/job-list"}>
                  Việc làm
                  <ChevronDownIcon className="w-4 ml-1" />
                </Link>
              </li>
              <li className="px-5 py-2.5">
                <Link className="flex items-center" to={"/"}>
                  Tạo CV
                  <ChevronDownIcon className="w-4 ml-1" />
                </Link>
              </li>
              <li className="px-5 py-2.5">
                <Link to={"/"}>Giới thiệu</Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <ButtonArrowOne>Đăng một công việc</ButtonArrowOne>
            <div className="flex justify-center items-center w-[46px] h-[46px] rounded-full bg-white-low">
              <BellIcon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 p-2 h-[46px] rounded-full bg-white-low">
              <UserCircleIcon className="w-6 h-6" />
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
