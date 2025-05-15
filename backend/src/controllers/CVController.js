const CV = require('../models/CV')
const Account = require('../models/Account')
const Student = require('../models/Student')
const puppeteer = require('puppeteer')

class CVController {
  // [GET] /cv
  async getAllStudentCV(req, res, next) {
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

  // [GET] /cv/:id
  async getStudentCV(req, res) {
    try {
      const accountId = req.account._id
      const cvId = req.params.id

      const student = await Student.findOne({ account: accountId })
      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' })

      const cv = await CV.findOne({ student: student._id, _id: cvId })
      if (!cv) return res.status(404).json({ message: 'CV không tồn tại' })
      res.status(200).json(cv)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy CV', error: err.message })
    }
  }

  // [POST] /cv
  async createStudentCV(req, res) {
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

  // [PUT] /cv
  async updateStudentCV(req, res) {
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
  async deleteStudentCV(req, res) {
    try {
      const cvId = req.params.id
      const cv = await CV.findByIdAndDelete(cvId)
      if (!cv) return res.status(404).json({ message: 'CV không tồn tại' })
      res.status(200).json({ message: 'Xoá CV thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi xoá CV', error: err.message })
    }
  }

  // [POST] /cv/generate-pdf
  async generatePDF(req, res) {
    const { html, fileName } = req.body
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
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length
      })

      res.end(pdfBuffer)
    } catch (error) {
      console.error('PDF error:', error)
      res.status(500).json({ message: 'Lỗi khi tạo PDF', error: error.message })
    }
  }
}

module.exports = new CVController()
