import React, { useEffect, useState } from "react";
import Logo2 from "../assets/Logo2.svg";
import { Link, useNavigate } from "react-router-dom";
import {
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import ButtonArrowOne from "../shared/ButtonArrowOne";
import { ROUTES } from "../routes/routePaths";

const NavBar = () => {
  const navigate = useNavigate();
  const [isTopOfPage, setIsTopOfPage] = useState(true);
  const [hoveredMenu, setHoveredMenu] = useState(null); // State để quản lý menu đang được hover
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [userInfo, setUserInfo] = useState(null); // Thông tin người dùng

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
      }
      if (window.scrollY > 100) setIsTopOfPage(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin người dùng từ localStorage
    if (user) {
      setIsLoggedIn(true);
      setUserInfo(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Xóa thông tin người dùng khỏi localStorage
    setIsLoggedIn(false);
    setUserInfo(null);
    navigate(ROUTES.LOGIN);
  };

  const navbarStyle = isTopOfPage
    ? "py-5"
    : "fixed top-0 left-0 z-50 py-2 drop-shadow animate-slideDown";

  return (
    <div
      className={`${navbarStyle} w-full bg-white transition-all duration-300`}
    >
      <div className="container-responsive">
        <div className="flex justify-between items-center h-[64px]">
          <div>
            <img src={Logo2} alt="logo2" className="h-10" />
          </div>

          <div>
            <ul className="flex font-medium relative">
              <li className="px-5 py-2.5">
                <Link
                  to={ROUTES.HOME}
                  className="hover:text-blue transition-colors duration-300"
                >
                  Trang chủ
                </Link>
              </li>
              <li
                className="px-5 py-2.5 relative group"
                onMouseEnter={() => setHoveredMenu("jobList")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link
                  to={ROUTES.JOB_LIST}
                  className="flex items-center group-hover:text-blue transition-colors duration-300"
                >
                  Việc làm
                  <ChevronDownIcon className="w-4 ml-1" />
                </Link>
                {hoveredMenu === "jobList" && (
                  <div className="w-[500px] absolute top-full -left-1/2 z-50">
                    <ul className="grid grid-cols-2 bg-white-bright shadow-md rounded-small p-5 transition-all duration-500 mt-6">
                      <li className="px-4 py-2 hover:text-blue transition-colors duration-300">
                        <Link to={ROUTES.JOB_LIST}>Danh sách việc làm</Link>
                      </li>
                      <li className="px-4 py-2 hover:text-blue transition-colors duration-300">
                        <Link to={ROUTES.SAVED_JOB}>Việc làm đã lưu</Link>
                      </li>
                      <li className="px-4 py-2 hover:text-blue transition-colors duration-300">
                        <Link to={ROUTES.JOB_LIST}>Việc làm đã ứng tuyển</Link>
                      </li>
                      <li className="px-4 py-2 hover:text-blue transition-colors duration-300">
                        <Link to={ROUTES.JOB_POST}>Đăng việc làm</Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
              <li
                className="px-5 py-2.5 relative group"
                onMouseEnter={() => setHoveredMenu("createCV")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link
                  to={ROUTES.CREATE_CV}
                  className="flex items-center cursor-pointer group-hover:text-blue transition-colors duration-300"
                >
                  Tạo CV
                  <ChevronDownIcon className="w-4 ml-1" />
                </Link>
                {hoveredMenu === "createCV" && (
                  <div className="w-[300px] absolute top-full -left-1/2 z-50">
                    <ul className="grid grid-cols-2 bg-white-bright shadow-md rounded-small p-5 transition-all duration-500 mt-6">
                      <li className="px-4 py-2 hover:text-blue transition-colors duration-300">
                        <Link to={ROUTES.CV_MANAGEMENT}>Quản lý CV</Link>
                      </li>
                      <li className="px-4 py-2 hover:text-blue transition-colors duration-300">
                        <Link to={ROUTES.CREATE_CV}>Tạo CV mới</Link>
                      </li>
                      <li className="px-4 py-2 hover:text-blue transition-colors duration-300">
                        <Link to={ROUTES.UPLOAD_CV}>Upload CV</Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
              <li className="px-5 py-2.5">
                <Link
                  to={ROUTES.HOME}
                  className="hover:text-blue transition-colors duration-300"
                >
                  Giới thiệu
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              // Hiển thị thông tin tài khoản khi đã đăng nhập
              <div className="flex items-center gap-4">
                <ButtonArrowOne selectedPage={ROUTES.JOB_POST}>
                  Đăng một công việc
                </ButtonArrowOne>
                <div className="flex justify-center items-center w-[46px] h-[46px] rounded-full bg-white-low">
                  <BellIcon className="w-6 h-6" />
                </div>
                <div
                  className="relative flex items-center gap-2 p-2 h-[46px] rounded-full bg-white-low cursor-pointer"
                  onMouseEnter={() => setHoveredMenu("account")}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <UserCircleIcon className="w-6 h-6" />
                  <ChevronDownIcon className="w-4 h-4" />
                  {hoveredMenu === "account" && (
                    <div className="w-[300px] absolute top-full right-0 z-50">
                      <ul className="grid grid-cols-1 bg-white-bright shadow-md rounded-small p-5 transition-all duration-500 mt-6">
                        <li className="flex items-center gap-5 mb-2 px-4 pt-2 pb-4 border-b border-gray-light">
                          <img
                            src={
                              userInfo?.avatar ||
                              "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg"
                            }
                            alt="avatar"
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex flex-col justify-between">
                            <p className="font-semibold">{userInfo?.userName}</p>
                            <p className="text-sm">{userInfo?.email}</p>
                          </div>
                        </li>
                        <li className="px-4 py-2 hover:text-blue transition-colors duration-300">
                          <Link to={ROUTES.SET_INFORMATION}>
                            Thông tin cá nhân
                          </Link>
                        </li>
                        <li className="px-4 py-2 hover:text-blue transition-colors duration-300">
                          <Link to={ROUTES.CV_MANAGEMENT}>
                            CV của tôi
                          </Link>
                        </li>
                        <li className="px-4 py-2 hover:text-blue transition-colors duration-300">
                          <Link to={ROUTES.SAVED_JOB}>
                            Việc làm đã lưu
                          </Link>
                        </li>
                        <li className="px-4 py-2 hover:text-blue transition-colors duration-300">
                          <Link to={ROUTES.SAVED_JOB}>
                            Việc làm đã ứng tuyển
                          </Link>
                        </li>
                        <li className="px-4 py-2">
                          <button
                            onClick={handleLogout}
                            className="bg-blue text-white-bright w-full py-2.5 rounded-full text-center hover:bg-blue-mid cursor-pointer"
                          >
                            Đăng xuất
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Hiển thị nút "Đăng nhập" và "Đăng ký" khi chưa đăng nhập
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="bg-blue text-white-bright px-4 py-2.5 rounded-full text-center hover:bg-blue-mid cursor-pointer"
                >
                  Đăng nhập
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="bg-gray-light text-black px-4 py-2.5 rounded-full text-center hover:bg-gray cursor-pointer"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
