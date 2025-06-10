const mongoose = require('mongoose')
const Major = require('../models/Major')
const Specialization = require('../models/Specialization')

const data = [
  {
    'name': 'Quản lý Giáo dục',
    'description': 'Đào tạo quản lý giáo dục ở trường phổ thông.',
    'specializations': []
  },
  {
    'name': 'Giáo dục mầm non',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Giáo dục Tiểu học',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Giáo dục Chính trị',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Giáo dục thể chất',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Sư phạm Toán học',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Sư phạm Tin học',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Sư phạm Vật lý',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Sư phạm Hóa học',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Sư phạm Sinh học',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Sư phạm Ngữ Văn',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Sư phạm Lịch sử',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Sư phạm Địa lý',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Sư phạm Tiếng Anh',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Sư phạm Khoa học tự nhiên',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Sư phạm Lịch sử - Địa lý',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Ngôn ngữ Anh',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Ngôn ngữ Trung Quốc',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Văn học',
    'description': '',
    'specializations': [
      { 'name': 'Báo chí', 'description': '' }
    ]
  },
  {
    'name': 'Kinh tế',
    'description': '',
    'specializations': [
      { 'name': 'Kinh tế đầu tư', 'description': '' },
      { 'name': 'Kinh tế phát triển', 'description': '' }
    ]
  },
  {
    'name': 'Kế toán',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Kiểm toán',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Luật',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Hóa học',
    'description': '',
    'specializations': [
      { 'name': 'Kiểm nghiệm và quản lý chất lượng sản phẩm', 'description': '' },
      { 'name': 'Hóa học ứng dụng', 'description': '' }
    ]
  },
  {
    'name': 'Khoa học vật liệu',
    'description': '',
    'specializations': [
      { 'name': 'Khoa học vật liệu tiên tiến và công nghệ nano', 'description': '' }
    ]
  },
  {
    'name': 'Công nghệ kỹ thuật hóa học',
    'description': '',
    'specializations': [
      { 'name': 'Công nghệ môi trường', 'description': '' },
      { 'name': 'Công nghệ hữu cơ - hóa dầu', 'description': '' }
    ]
  },
  {
    'name': 'Kỹ thuật xây dựng',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Kỹ thuật điện',
    'description': '',
    'specializations': [
      { 'name': 'Kỹ thuật điện – điện tử', 'description': '' },
      { 'name': 'Kỹ thuật điện và CNTT', 'description': '' }
    ]
  },
  {
    'name': 'Kỹ thuật điện tử - viễn thông',
    'description': '',
    'specializations': [
      { 'name': 'Hệ thống nhúng và IoT', 'description': '' },
      { 'name': 'Thiết kế vi mạch', 'description': '' }
    ]
  },
  {
    'name': 'Kỹ thuật phần mềm',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Công nghệ thông tin',
    'description': '',
    'specializations': [
      { 'name': 'Trí tuệ nhân tạo', 'description': '' },
      { 'name': 'Công nghệ phần mềm', 'description': '' },
      { 'name': 'Hệ thống thông tin', 'description': '' },
      { 'name': 'Mạng máy tính', 'description': '' }
    ]
  },
  {
    'name': 'Khoa học dữ liệu',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Công nghệ kỹ thuật ô tô',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Vật lý kỹ thuật',
    'description': '',
    'specializations': [
      { 'name': 'Bán dẫn', 'description': '' }
    ]
  },
  {
    'name': 'Công nghệ thực phẩm',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Nông học',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Công tác xã hội',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Quản trị dịch vụ du lịch và lữ hành',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Quản trị khách sạn',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Quản lý tài nguyên và môi trường',
    'description': '',
    'specializations': []
  },
  {
    'name': 'Quản lý đất đai',
    'description': '',
    'specializations': []
  }
]

// Hàm chính
async function seed() {
  try {
    await Major.deleteMany({})
    await Specialization.deleteMany({})
    console.log('🗑️ Xóa dữ liệu cũ')

    for (const majorData of data) {
      const major = new Major({
        name: majorData.name,
        description: majorData.description
      })
      const savedMajor = await major.save()

      for (const spec of majorData.specializations) {
        const specialization = new Specialization({
          name: spec.name,
          description: spec.description,
          major: savedMajor._id
        })
        await specialization.save()
      }
    }

    console.log('✅ Đã thêm dữ liệu ngành và chuyên ngành thành công.')
  } catch (err) {
    console.error('❌ Lỗi khi thêm dữ liệu:', err)
  } finally {
    mongoose.connection.close()
  }
}

seed()
