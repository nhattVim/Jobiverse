import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Link } from "react-router-dom";

const ButtonArrowOne = ({ children }) => {
  return (
    <Link className="flex items-center justify-center bg-blue text-white rounded-full py-2 pl-3 pr-2 font-semibold gap-2.5">
      {children}
      <div className="bg-white rounded-full flex items-center justify-center w-[30px] h-[30px]">
        <ArrowUpRightIcon className="w-5 h-5 text-blue font-semibold" />
      </div>
    </Link>
  );
};

export default ButtonArrowOne;
