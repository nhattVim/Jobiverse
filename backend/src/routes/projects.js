const express = require('express');
const router = express.Router();
const projectController = require('../controllers/ProjectController');
const verifyToken = require('../middlewares/verifyToken');

router.use(verifyToken([]));
router.get('/', projectController.getAllProjects);
router.get('/my', projectController.getProjects);
router.post('/my', projectController.createProject);
router.put('/my/:id', projectController.updateProject);
router.put('/my/:id/status', projectController.updateProjectStatus);
router.delete('/my/:id', projectController.deleteProject);

router.post('/:projectId/apply', verifyToken(["student"]), projectController.applyToProject);
router.post('/:projectId/respond/:studentId', verifyToken([]), projectController.respondToApplication);

module.exports = router;