const express = require('express')
const router = express.Router()
const projectController = require('../controllers/ProjectController')
const verifyToken = require('../middlewares/verifyToken')

router.get('/', projectController.getAllProjects)
router.get('/latest', projectController.getProjectsLatest)
router.get('/detail/:id', projectController.getProjectById)
router.get('/employer/:id', projectController.getProjectsByEmployer)
router.get('/rcm/:id', projectController.RcmProjectByProject)
router.get('/rcm/student/:id', projectController.RcmStudentByProject)
router.use(verifyToken([]))

router.get('/my', projectController.getProjects)
router.post('/my', projectController.createProject)

router.get('/applied', verifyToken(['student']), projectController.getProjectsApplied)
router.get('/invitations', verifyToken(['student']), projectController.getProjectInvitations)

router.put('/my/:id', projectController.updateProject)
router.put('/my/:id/status', projectController.updateProjectStatus)
router.delete('/my/:id', projectController.deleteProject)

router.post('/invitations/:projectId/:action', verifyToken([]), projectController.studentResponeInvitations)
router.post('/:projectId/invite/:studentId', verifyToken([]), projectController.InviteStudentToProject)
router.post('/:projectId/apply', verifyToken(['student']), projectController.applyToProject)
router.post('/:projectId/respond/:studentId', verifyToken([]), projectController.respondToApplication)

router.delete('/applied/:id', verifyToken(['student']), projectController.deleteAppliedProject)
router.delete('/invited/:projectId/:studentId', verifyToken([]), projectController.deleteStudentInvited)

module.exports = router
