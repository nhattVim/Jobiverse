import React from "react";

const personalFields = {
  birthday: { label: "Ngày sinh", placeholder: "DD/MM/YYYY" },
  gender: { label: "Giới tính", placeholder: "Nam/Nữ" },
  phone: { label: "Số điện thoại", placeholder: "0123456789" },
  email: { label: "Email", placeholder: "example@gmail.com" },
  address: { label: "Địa chỉ", placeholder: "Tp Quy Nhơn, Bình Định" },
  website: { label: "Website", placeholder: "facebook.com/Jobiverse.vn" },
};

export default function CVPreview({ cvData }) {
  return (
    <div className="w-full bg-[#f2f3f7] rounded-xl border p-6 text-[#1c1c1c] grid grid-cols-3 gap-2">
      <div className="col-span-1 space-y-2 border-2">
        <h1 className="text-3xl font-bold font-['Noto_Sans'] leading-9 mt-2">{cvData.name || 'Họ tên ứng viên'}</h1>

        {cvData.avatar ? (
          <img src={cvData.avatar} alt="avatar" className="object-cover w-full border shadow aspect-square" />
        ) : (
          <div className="flex items-center justify-center w-full bg-gray-200 border aspect-square">
            <span className="text-4xl">👤</span>
          </div>
        )}

        <div className="p-3 text-white bg-gray-700">
          {Object.entries(personalFields).map(([key, { label, placeholder }]) => (
            <div key={key}>
              <p className="py-2 font-medium">{label}</p>
              {cvData[key] ? (
                <p className="pb-4 text-sm italic break-words">{cvData[key]}</p>
              ) : (
                <p className="pb-4 text-sm italic text-[#cccc]">{placeholder}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2 border-4"></div>
    </div>
  )
}
