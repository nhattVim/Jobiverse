import React, { useState } from "react";
import CVForm from "../components/CVForm";
import CVPreview from "../components/CVPreview";

export default function CreateCV() {
  const [cvData, setCvData] = useState({
    avatar: "",
    name: "",
    birthday: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    sumary: "",
    website: "",
    summary: "",
    experiences: [],
    educations: [],
    skills: [],
    languages: [],
    socials: [],
  });

  return (
    <div className="min-h-screen bg-[#f2f3f7] font-sans text-[#1c1c1c] flex flex-col md:flex-row">
      <div className="flex items-start justify-center w-full h-screen p-6 overflow-y-auto md:w-1/2">
        <CVForm cvData={cvData} setCvData={setCvData} />
      </div>
      <div className="md:w-1/2 w-full bg-white shadow-xl p-6 flex justify-center items-start min-h-[92vh] h-screen overflow-y-auto">
        <CVPreview cvData={cvData} />
      </div>
    </div>
  );
}
