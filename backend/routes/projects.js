const express = require('express');
const router = express.Router();
const projectController = require('../controllers/ProjectController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', projectController.getAllProjects);

router.use(verifyToken("employer"));
router.get('/my', projectController.getProjectsByToken);
router.delete('/my/:id', projectController.deleteProject);
router.post('/my', projectController.createProject);

module.exports = router;