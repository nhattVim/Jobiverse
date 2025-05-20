const multer = require('multer')
const storage = multer.memoryStorage()

// const fileFilter = (req, file, cb) => {
//   if (!file.mimetype.startsWith('application/pdf')) {
//     return cb(new Error('Chỉ cho phép upload file PDF'), false)
//   }
//   cb(null, true)
// }

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
  // fileFilter
})

module.exports = {
  uploadSingle: (fieldName) => upload.single(fieldName),
  uploadMultiple: (fieldName, maxCount = 5) => upload.array(fieldName, maxCount)
}
