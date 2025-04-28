const express = require('express');
const router = express.Router();
const projectController = require('../controllers/ProjectController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken(["employer", "student"]), projectController.getAllProjects);
router.get('/my', verifyToken(["employer"]), projectController.getProjects);
router.post('/my', verifyToken(["employer"]), projectController.createProject);
router.put('/my/:id', verifyToken(["employer"]), projectController.updateProject);
router.put('/my/:id/status', verifyToken(["employer"]), projectController.updateProjectStatus);
router.delete('/my/:id', verifyToken(["employer"]), projectController.deleteProject);

router.post('/:projectId/apply', verifyToken(["student"]), projectController.applyToProject);
router.post('/:projectId/respond/:studentId', verifyToken(["employer"]), projectController.respondToApplication);

module.exports = router;