const express = require('express');
const router = express.Router();
const projectController = require('../controllers/ProjectController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken([]), projectController.getAllProjects);
router.get('/my', verifyToken([]), projectController.getProjects);
router.post('/my', verifyToken([]), projectController.createProject);
router.put('/my/:id', verifyToken([]), projectController.updateProject);
router.put('/my/:id/status', verifyToken([]), projectController.updateProjectStatus);
router.delete('/my/:id', verifyToken([]), projectController.deleteProject);

router.post('/:projectId/apply', verifyToken(["student"]), projectController.applyToProject);
router.post('/:projectId/respond/:studentId', verifyToken(["employer"]), projectController.respondToApplication);

module.exports = router;