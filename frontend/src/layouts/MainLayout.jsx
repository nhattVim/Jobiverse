import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavBar />
      <main className="grow">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
