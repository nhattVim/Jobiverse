import React, { useState } from "react";
import CVForm from "../components/CVForm";
import CVPreview from "../components/CVPreview";
import BannerText from "../components/BannerText";
import apiFetch from "../services/api";

export default function CreateCV() {
  const [cvData, setCvData] = useState({
    avatar: "",
    name: "",
    birthday: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    summary: "",
    desiredPosition: "",
    experiences: [],
    educations: [],
    activities: [],
    achievements: [],
    languages: [],
    socials: [],
    skills: [],
  });

  const handleSubmit = async () => {
    try {
      await apiFetch("/cv", "PUT", cvData);
      alert("Tạo CV thành công!");
    } catch (error) {
      alert("Tạo CV thất bại, vui lòng thử lại. " + error.message);
    }
  };

  return (
    <>
      <BannerText
        title="Tạo CV"
        caption="Cùng Jobiverse biến chiếc CV đơn điệu trở thành sân khấu biểu diễn độc nhất của riêng bạn với những mẫu CV từ đơn giản, chuyên nghiệp tới sáng tạo nhất được thiết kế riêng cho từng ngành nghề."
      />

      <div className="w-full py-20">
        <div className="container-responsive">
          <div className="min-h-screen bg-white font-sans text-[#1c1c1c] flex flex-col md:flex-row h-auto gap-10">
            <div className="sticky top-[130px] flex items-start justify-center w-full h-auto md:w-1/2 max-h-screen overflow-y-hidden">
              <CVForm
                cvData={cvData}
                setCvData={setCvData}
                onSubmit={handleSubmit}
              />
            </div>
            <div className="md:w-1/2 w-full flex justify-center items-start min-h-[92vh] overflow-y-auto h-auto">
              <CVPreview cvData={cvData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
