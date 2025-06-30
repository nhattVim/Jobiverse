const mongoose = require('mongoose')
const Major = require('../models/Major')
const Specialization = require('../models/Specialization')
const Account = require('../models/Account')
const CV = require('../models/CV')
const CVUpload = require('../models/CVUpload')
const Employer = require('../models/Employer')
const Favorite = require('../models/Favorite')
const Notification = require('../models/Notification')
const Project = require('../models/Project')
const Student = require('../models/Student')

// Data
const majorsData = require('./majorsData.json')
const base64Image = require('./base64Image.js')
const avatarBuffer = Buffer.from(base64Image, 'base64')

require('dotenv').config({ path: '../../.env' })

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Đã kết nối MongoDB')
}).catch((err) => {
  console.error('❌ Lỗi kết nối:', err)
})

async function seedAll() {
  try {
    await Promise.all([
      Account.deleteMany({}),
      CV.deleteMany({}),
      CVUpload.deleteMany({}),
      Employer.deleteMany({}),
      Favorite.deleteMany({}),
      Major.deleteMany({}),
      Notification.deleteMany({}),
      Project.deleteMany({}),
      Specialization.deleteMany({}),
      Student.deleteMany({})
    ])

    console.log('🗑️ Đã xóa dữ liệu cũ')

    const majors = []
    const specializations = []

    for (const majorData of majorsData) {
      const major = new Major({
        name: majorData.name,
        description: majorData.description
      })
      await major.save()
      majors.push(major)

      for (const spec of majorData.specializations) {
        const specialization = new Specialization({
          name: spec.name,
          description: spec.description,
          major: major._id
        })
        await specialization.save()
        specializations.push(specialization)
      }
    }

    const accounts = []
    const password = '123456'

    for (let i = 1; i <= 10; i++) {
      let role, authProvider
      if (i <= 5) {
        role = 'student'
        authProvider = 'local'
      } else if (i <= 9) {
        role = 'employer'
        authProvider = 'google'
      } else {
        role = 'admin'
        authProvider = 'local'
      }

      const account = new Account({
        role,
        authProvider,
        avatar: {
          data: avatarBuffer,
          contentType: 'image/png'
        },
        email: `user${i}@example.com`,
        phoneNumber: `098765432${i}`,
        password: password,
        profile: true
      })
      await account.save()
      accounts.push(account)
    }

    // 3. Tạo sinh viên
    const students = []
    const universities = ['Đại học Bách Khoa', 'Đại học Kinh tế', 'Đại học Sư phạm', 'Đại học FPT', 'Đại học RMIT']

    for (let i = 0; i < 5; i++) {
      const selectedMajor = majors[Math.floor(Math.random() * majors.length)]
      const relatedSpecializations = specializations.filter(s => s.major.toString() === selectedMajor._id.toString())
      const selectedSpecialization = relatedSpecializations.length > 0
        ? relatedSpecializations[Math.floor(Math.random() * relatedSpecializations.length)]._id
        : null

      const student = new Student({
        account: accounts[i]._id,
        mssv: `SV00${i + 1}`,
        name: `Sinh viên ${i + 1}`,
        major: selectedMajor._id,
        specialization: selectedSpecialization,
        interests: ['Lập trình', 'Thiết kế', 'Kinh doanh'],
        university: universities[i % universities.length]
      })
      await student.save()
      students.push(student)
    }

    // 4. Tạo nhà tuyển dụng
    const employers = []
    const industries = ['Công nghệ', 'Tài chính', 'Giáo dục', 'Y tế', 'Bất động sản']

    for (let i = 5; i < 9; i++) {
      const employer = new Employer({
        account: accounts[i]._id,
        businessScale: i % 2 === 0 ? 'Private individuals' : 'Companies',
        companyName: `Công ty ${i - 4}`,
        representativeName: `Người đại diện ${i - 4}`,
        position: 'Giám đốc',
        interests: ['Tuyển dụng', 'Phát triển'],
        industry: industries[(i - 5) % industries.length],
        companyInfo: `Thông tin công ty ${i - 4}`,
        prove: `https://example.com/prove/${i - 4}`,
        address: `Địa chỉ ${i - 4}`
      })
      await employer.save()
      employers.push(employer)
    }

    // 5. Tạo CV
    const cvs = []
    for (let i = 0; i < students.length; i++) {
      for (let j = 1; j <= 2; j++) {
        const cv = new CV({
          student: students[i]._id,
          title: `CV ${j} của ${students[i].name}`,
          name: students[i].name,
          birthday: new Date(2000, i, j + 1),
          gender: i % 2 === 0 ? 'Nam' : 'Nữ',
          phone: `098765432${i}`,
          email: accounts[i].email,
          address: `Địa chỉ sinh viên ${i + 1}`,
          summary: `Tóm tắt kinh nghiệm ${j}`,
          desiredPosition: `Vị trí mong muốn ${j}`,
          experiences: [{
            position: 'Thực tập sinh',
            company: 'Công ty thực tập',
            start: new Date(2022, 1, 1),
            end: new Date(2022, 6, 30),
            description: 'Mô tả kinh nghiệm'
          }],
          educations: [{
            degree: 'Cử nhân',
            school: students[i].university,
            start: new Date(2018, 8, 1),
            end: new Date(2023, 5, 30)
          }],
          skills: ['JavaScript', 'React', 'Node.js']
        })
        await cv.save()
        cvs.push(cv)
      }
    }

    // 6. Tải lên CV
    const cvUploads = []
    for (let i = 0; i < students.length; i++) {
      for (let j = 1; j <= 2; j++) {
        const cvUpload = new CVUpload({
          student: students[i]._id,
          title: `CV Upload ${j}`,
          fileName: `cv_${students[i].mssv}_${j}.pdf`,
          file: Buffer.from(`Nội dung CV ${j} của ${students[i].name}`)
        })
        await cvUpload.save()
        cvUploads.push(cvUpload)
      }
    }

    // 7. Cập nhật CV mặc định cho sinh viên
    for (let i = 0; i < students.length; i++) {
      students[i].defaultCV = {
        cv: cvs[i * 2]._id,
        type: 'CV'
      }
      await students[i].save()
    }

    // 8. Tạo dự án
    const projects = []
    const projectTitles = [
      'Phát triển ứng dụng web',
      'Thiết kế giao diện người dùng',
      'Phân tích dữ liệu',
      'Marketing Online',
      'Quản lý dự án'
    ]

    for (let i = 0; i < employers.length; i++) {
      for (let j = 1; j <= 2; j++) {
        const selectedMajor = majors[Math.floor(Math.random() * majors.length)]
        const relatedSpecializations = specializations.filter(s => s.major.toString() === selectedMajor._id.toString())
        const selectedSpecialization = relatedSpecializations.length > 0
          ? [relatedSpecializations[Math.floor(Math.random() * relatedSpecializations.length)]._id]
          : []

        const project = new Project({
          account: accounts[i + 5]._id,
          title: `${projectTitles[(i + j) % projectTitles.length]} ${j}`,
          description: `Mô tả dự án ${j}`,
          location: {
            province: `Tỉnh ${j}`,
            district: `Quận ${j}`,
            ward: `Phường ${j}`
          },
          major: [selectedMajor._id],
          specialization: selectedSpecialization,
          content: `Nội dung chi tiết dự án ${j}`,
          workingTime: 'Toàn thời gian',
          status: 'open',
          salary: 10000000 + i * 1000000,
          expRequired: j,
          deadline: new Date(2024, 11, 30),
          hiringCount: j + 1,
          workType: j % 2 === 0 ? 'online' : 'offline'
        })
        await project.save()
        projects.push(project)
      }
    }

    // Thêm 2 dự án bổ sung để đủ 10
    for (let i = 0; i < 2; i++) {
      const project = new Project({
        account: accounts[5]._id,
        title: `Dự án bổ sung ${i + 1}`,
        description: `Mô tả dự án bổ sung ${i + 1}`,
        location: {
          province: `Tỉnh ${i + 3}`,
          district: `Quận ${i + 3}`,
          ward: `Phường ${i + 3}`
        },
        major: [majors[i % majors.length]._id],
        content: `Nội dung chi tiết dự án bổ sung ${i + 1}`,
        workingTime: 'Bán thời gian',
        status: 'open',
        salary: 8000000,
        expRequired: 0,
        deadline: new Date(2024, 10, 15),
        hiringCount: 1,
        workType: 'online'
      })
      await project.save()
      projects.push(project)
    }

    // 9. Tạo ứng viên cho dự án
    for (const project of projects) {
      const applicantCount = Math.min(3, students.length)
      for (let i = 0; i < applicantCount; i++) {
        const student = students[i]
        const cvType = i % 2 === 0 ? 'CV' : 'CVUpload'
        const cvRef = i % 2 === 0
          ? cvs.find(cv => cv.student.equals(student._id))._id
          : cvUploads.find(cv => cv.student.equals(student._id))._id

        project.applicants.push({
          student: student._id,
          cv: cvRef,
          cvType,
          coverLetter: `Thư xin việc của ${student.name} cho dự án ${project.title}`,
          status: ['pending', 'rejected', 'accepted'][i % 3]
        })
      }
      await project.save()
    }

    // 10. Tạo mục yêu thích
    const favorites = []
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 2; j++) {
        const favorite = new Favorite({
          account: accounts[i]._id,
          project: projects[(i + j) % projects.length]._id
        })
        await favorite.save()
        favorites.push(favorite)
      }
    }

    // 11. Tạo thông báo
    const notifications = []
    for (let i = 0; i < 10; i++) {
      const notification = new Notification({
        account: accounts[i % accounts.length]._id,
        content: `Thông báo quan trọng #${i + 1}`
      })
      await notification.save()
      notifications.push(notification)
    }

    console.log('✅ Đã tạo dữ liệu mẫu thành công:')
    console.log(`- Tài khoản: ${accounts.length}`)
    console.log(`- Sinh viên: ${students.length}`)
    console.log(`- Nhà tuyển dụng: ${employers.length}`)
    console.log(`- CV: ${cvs.length}`)
    console.log(`- CV Tải lên: ${cvUploads.length}`)
    console.log(`- Dự án: ${projects.length}`)
    console.log(`- Mục yêu thích: ${favorites.length}`)
    console.log(`- Thông báo: ${notifications.length}`)
    console.log(`- Ngành học: ${majors.length}`)
    console.log(`- Chuyên ngành: ${specializations.length}`)

  } catch (err) {
    console.error('❌ Lỗi khi tạo dữ liệu:', err)
  } finally {
    mongoose.connection.close()
  }
}

seedAll()
