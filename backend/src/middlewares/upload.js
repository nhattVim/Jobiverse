const multer = require('multer')
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Chỉ cho phép upload file ảnh'), false)
  }
  cb(null, true)
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
})

module.exports = {
  uploadSingle: (fieldName) => upload.single(fieldName),
  upload
}
