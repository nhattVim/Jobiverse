const mongoose = require("mongoose");
const Major = require("../models/student/Major");
const Specialization = require("../models/student/Specialization");

// Kết nối MongoDB
mongoose.connect("mongodb+srv://nhattVim:nhattVim2%2A@nhattvim.altt30u.mongodb.net/Jobiverse?retryWrites=true&w=majority&appName=nhattVim", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Đã kết nối MongoDB");
}).catch((err) => {
  console.error("❌ Lỗi kết nối:", err);
});

// Dữ liệu ngành & chuyên ngành QNU (mẫu)
const data = [
  {
    name: "Công nghệ thông tin",
    description: "Ngành đào tạo kỹ sư phần mềm, hệ thống thông tin và mạng máy tính.",
    specializations: [
      { name: "Kỹ thuật phần mềm", description: "Phát triển phần mềm ứng dụng, web, mobile." },
      { name: "Hệ thống thông tin", description: "Xây dựng và quản lý hệ thống thông tin doanh nghiệp." },
      { name: "Mạng máy tính", description: "Thiết kế và vận hành hệ thống mạng, bảo mật." },
    ]
  },
  {
    name: "Sư phạm Toán học",
    description: "Đào tạo giáo viên Toán cấp phổ thông.",
    specializations: [
      { name: "Toán ứng dụng", description: "Ứng dụng Toán học trong kỹ thuật và kinh tế." },
      { name: "Giải tích", description: "Nghiên cứu hàm số, tích phân và vi phân." },
    ]
  },
  {
    name: "Kinh tế",
    description: "Ngành nghiên cứu về phân tích và điều hành hoạt động kinh tế.",
    specializations: [
      { name: "Kinh tế phát triển", description: "Phân tích và phát triển kinh tế khu vực." },
      { name: "Kinh tế quốc tế", description: "Thương mại và chính sách kinh tế quốc tế." },
    ]
  },
  {
    name: "Ngôn ngữ Anh",
    description: "Đào tạo cử nhân tiếng Anh ứng dụng và giảng dạy.",
    specializations: [
      { name: "Biên - Phiên dịch", description: "Dịch thuật trong các lĩnh vực chuyên ngành." },
      { name: "Tiếng Anh thương mại", description: "Sử dụng tiếng Anh trong môi trường kinh doanh." },
    ]
  },
];

// Hàm chính
async function seed() {
  try {
    await Major.deleteMany({});
    await Specialization.deleteMany({});
    console.log("🗑️ Xóa dữ liệu cũ");

    for (const majorData of data) {
      const major = new Major({
        name: majorData.name,
        description: majorData.description
      });
      const savedMajor = await major.save();

      for (const spec of majorData.specializations) {
        const specialization = new Specialization({
          name: spec.name,
          description: spec.description,
          major: savedMajor._id
        });
        await specialization.save();
      }
    }

    console.log("✅ Đã thêm dữ liệu ngành và chuyên ngành thành công.");
  } catch (err) {
    console.error("❌ Lỗi khi thêm dữ liệu:", err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
