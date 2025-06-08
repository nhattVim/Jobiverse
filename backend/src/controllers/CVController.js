const CV = require('../models/CV')
const CVUpload = require('../models/CVUpload')
const Student = require('../models/Student')
const puppeteer = require('puppeteer')

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
        'Content-Disposition': `inline; filename="${cv.fileName}"`
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

      if (!files || files.length === 0) return res.status(400).json({ message: 'Không có tệp nào được tải lên' })

      const student = await Student.findOne({ account: accountId })
      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' })

      const uploadedFiles = await Promise.all(
        files.map(file =>
          CVUpload.create({
            student: student._id,
            title: file.originalname,
            fileName: file.originalname,
            file: file.buffer,
            fileType: file.mimetype
          })
        )
      )

      res.status(201).json({ message: 'Tải lên CV thành công', uploadedFiles })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi tải lên CV', error: err.message })
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

  // [DELETE] /cv
  async deleteCV(req, res) {
    try {
      const cvId = req.params.id
      const cv = await CV.findByIdAndDelete(cvId)
      if (!cv) return res.status(404).json({ message: 'CV không tồn tại' })
      res.status(200).json({ message: 'Xoá CV thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi xoá CV', error: err.message })
    }
  }

  // [DELETE] /uploads/:id
  async deleteUpCV(req, res, next) {
    try {
      const cvId = req.params.id
      const upCV = await CVUpload.findByIdAndDelete(cvId)
      if (!upCV) return res.status(404).json({ message: 'CV không tồn tại' })
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
        printBackground: true,
        margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
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
