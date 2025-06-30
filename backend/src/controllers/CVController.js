const CV = require('../models/CV')
const CVUpload = require('../models/CVUpload')
const Student = require('../models/Student')
const puppeteer = require('puppeteer')
const contentDisposition = require('content-disposition')

class CVController {
  // [GET] /cv/my
  async getAllMyCV(req, res, next) {
    try {
      const accountId = req.account._id

      const student = await Student.findOne({ account: accountId })
      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' })

      const cvList = await CV.find({ student: student._id })
        .select('title desiredPosition lastUpdated')
        .sort({ lastUpdated: -1 })

      res.status(200).json(cvList)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy CV', error: err.message })
    }
  }

  // [GET] /cv/my/upload
  async getAllMyUpCv(req, res) {
    try {
      const student = await Student.findOne({ account: req.account._id })
      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' })
      const cvUploads = await CVUpload.find({ student: student._id })
        .select('title fileName fileType createdAt')
        .sort({ createdAt: -1 })
      res.status(200).json(cvUploads)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy CV', error: err.message })
    }
  }

  // [GET] /cv/:id
  async getCVById(req, res) {
    try {
      const cvId = req.params.id
      const cv = await CV.findOne({ _id: cvId })
      if (!cv) return res.status(404).json({ message: 'CV không tồn tại' })
      res.status(200).json(cv)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy CV', error: err.message })
    }
  }

  // [GET] /cv/uploads/:id
  async getUpCVById(req, res) {
    try {
      const cv = await CVUpload.findById(req.params.id)
      if (!cv) return res.status(404).send('CV not found')

      res.set({
        'Content-Type': cv.fileType,
        'Content-Disposition': contentDisposition(cv.fileName, { type: 'inline' })
      })

      res.status(200).end(cv.file)
    } catch (err) {
      res.status(500).send('Error when getting file')
    }
  }

  // [POST] /cv
  async createCV(req, res) {
    try {
      const accountId = req.account._id
      const content = req.body

      const student = await Student.findOne({ account: accountId })
      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' })

      const newCV = await CV.create({ student: student._id, ...content, lastUpdated: Date.now() })

      if (!student.defaultCV || !student.defaultCV.cv) {
        student.defaultCV = { cv: newCV._id, type: 'CV' }
        await student.save()
      }

      res.status(201).json({ message: 'Tạo CV thành công', newCV })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi tạo CV ' + err.message, err: err.message })
    }
  }

  // [POST] /cv/uploads
  async uploadCV(req, res) {
    try {
      const accountId = req.account._id
      const files = req.files

      if (!files || files.length === 0)
        return res.status(400).json({ message: 'Không có tệp nào được tải lên' })

      const student = await Student.findOne({ account: accountId })
      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' })

      const fixEncoding = (str) => {
        return Buffer.from(str, 'latin1').toString('utf8')
      }

      const file = files[0]
      const uploadedFile = await CVUpload.create({
        student: student._id,
        title: fixEncoding(file.originalname),
        fileName: fixEncoding(file.originalname),
        file: file.buffer,
        fileType: file.mimetype
      })

      if (!student.defaultCV || !student.defaultCV.cv) {
        student.defaultCV = { cv: uploadedFile._id, type: 'CVUpload' }
        await student.save()
      }

      res.status(201).json({ message: 'Tải lên CV thành công', uploadedFile })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi tải lên CV', error: err.message })
    }
  }

  // [GET] /cv/default
  async getDefaultCv(req, res) {
    try {
      const accountId = req.account._id

      const student = await Student.findOne({ account: accountId })
      if (!student || !student.defaultCV || !student.defaultCV.cv) {
        return res.status(404).json({ message: 'Sinh viên chưa có CV mặc định' })
      }

      const { cv: cvId, type } = student.defaultCV

      let defaultCVData
      if (type === 'CV') {
        defaultCVData = await CV.findById(cvId).lean()
      } else if (type === 'CVUpload') {
        defaultCVData = await CVUpload.findById(cvId).lean()
      } else {
        return res.status(400).json({ message: 'Loại CV không hợp lệ' })
      }

      if (!defaultCVData) {
        return res.status(404).json({ message: 'Không tìm thấy CV mặc định' })
      }

      res.json({ type, cv: defaultCVData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Lỗi server' })
    }
  }

  // [POST] /cv/:id/set-default
  async setDefaultCV(req, res) {
    try {
      const { id } = req.params
      const { type } = req.body

      if (!['CV', 'CVUpload'].includes(type)) {
        return res.status(400).json({ message: 'Loại CV không hợp lệ' })
      }

      const Model = type === 'CV' ? CV : CVUpload
      const cv = await Model.findById(id)
      if (!cv) return res.status(404).json({ message: 'CV không tồn tại' })

      const student = await Student.findOne({ account: req.account._id })
      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' })

      student.defaultCV = { cv: id, type }
      await student.save()

      res.json({ message: 'Cập nhật CV mặc định thành công' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Lỗi server' })
    }
  }

  // [PUT] /cv
  async updateCV(req, res) {
    try {
      const cvId = req.params.id

      const cv = await CV.findByIdAndUpdate(cvId, { ...req.body, lastUpdated: Date.now() }, { new: true })
      if (!cv) return res.status(404).json({ message: 'CV không tồn tại' })

      res.status(200).json({ cv })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi xử lý CV ' + err.message, error: err.message })
    }
  }

  // [DELETE] /cv/:id
  async deleteCV(req, res) {
    try {
      const cvId = req.params.id

      const cv = await CV.findById(cvId)
      if (!cv) return res.status(404).json({ message: 'CV không tồn tại' })

      const student = await Student.findById(cv.student)
      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' })

      if (student.defaultCV?.cv?.toString() === cvId && student.defaultCV?.type === 'CV') {
        student.defaultCV = undefined
        await student.save()
      }

      await CV.findByIdAndDelete(cvId)

      res.status(200).json({ message: 'Xoá CV thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi xoá CV', error: err.message })
    }
  }

  // [DELETE] /uploads/:id
  async deleteUpCV(req, res, next) {
    try {
      const cvId = req.params.id

      const upCV = await CVUpload.findById(cvId)
      if (!upCV) return res.status(404).json({ message: 'CV không tồn tại' })

      const student = await Student.findById(upCV.student)
      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' })

      if (student.defaultCV?.cv?.toString() === cvId && student.defaultCV?.type === 'CVUpload') {
        student.defaultCV = undefined
        await student.save()
      }

      await CVUpload.findByIdAndDelete(cvId)

      res.status(200).json({ message: 'Xoá CV thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi xoá CV', error: err.message })
    }
  }

  // [POST] /cv/generate-pdf
  async generatePDF(req, res) {
    const { html } = req.body
    if (!html) return res.status(400).send('HTML content is required')

    try {
      const browser = await puppeteer.launch({ headless: 'new' })
      const page = await browser.newPage()

      await page.setContent(html, { waitUntil: 'networkidle0' })

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true
      })

      await browser.close()

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="cv.pdf"',
        'Content-Length': pdfBuffer.length
      })

      res.status(200).end(pdfBuffer)
    } catch (error) {
      console.error('PDF error:', error)
      res.status(500).json({ message: 'Lỗi khi tạo PDF', error: error.message })
    }
  }
}

module.exports = new CVController()
