import { MapPinIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import React from "react";
import ButtonArrowOne from "../shared/ButtonArrowOne";

const JobListItem = ({
  jobTitle,
  companyInfo,
  jobType,
  salary,
  location,
  skill,
}) => {
  return (
    <div className="flex flex-col items-start gap-[30px] p-10 bg-white-mid rounded-medium w-full">
      <div className="flex flex-col items-start gap-5 w-full pb-[15px] border-b border-b-gray-light">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-5">
            <div className="w-[70px] h-[70px] bg-white border border-white-low rounded-small flex justify-center items-center">
              <img
                src={companyInfo.img}
                alt="imgcompany"
                className="w-10 h-10"
              />
            </div>

            <div className="flex flex-col justify-center gap-1">
              <h6 className="text-[22px] font-semibold leading-[28.6px]">
                {companyInfo.name}
              </h6>
              <p>{companyInfo.location}</p>
            </div>
          </div>

          <div className="px-2 py-1 bg-yellow rounded-[5px]">{jobType}</div>
        </div>

        <h6 className="text-[22px] font-semibold leading-[28.6px]">
          {jobTitle}
        </h6>

        <div className="flex flex-col gap-3">
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-6 h-6 text-blue mr-[6px]" />
            <p className="text-black-low">{salary}</p>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="w-6 h-6 text-blue mr-[6px]" />
            <p className="text-black-low">{location}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-1.5">
          {skill.map((item, index) => (
            <div
              key={index}
              className="text-center py-1 px-2.5 border border-gray-dark rounded-full"
            >
              <p className="text-sm text-black-low">{item}</p>
            </div>
          ))}
        </div>

        <ButtonArrowOne>Ứng tuyển</ButtonArrowOne>
      </div>
    </div>
  );
};

export default JobListItem;
