const express = require('express')
const router = express.Router()
const projectController = require('../controllers/ProjectController')
const verifyToken = require('../middlewares/verifyToken')

router.get('/', projectController.getAllProjects)
router.use(verifyToken([]))
router.get('/my', projectController.getProjects)
router.post('/my', projectController.createProject)
router.get('/my/:id', projectController.getProjectDetail)
router.put('/my/:id', projectController.updateProject)
router.put('/my/:id/status', projectController.updateProjectStatus)
router.delete('/my/:id', projectController.deleteProject)

router.get('/search', verifyToken(['student']), projectController.searchProjectsByMajorName)
router.get('/:id', projectController.RcmProjectByProject)
router.get('/student/:id', projectController.RcmProjectByStudent)


router.post('/:projectId/apply', verifyToken(['student']), projectController.applyToProject)
router.post('/:projectId/respond/:studentId', verifyToken([]), projectController.respondToApplication)

module.exports = router
