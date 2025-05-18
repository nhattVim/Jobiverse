const express = require('express')
const router = express.Router()
const FavoriteController = require('../controllers/FavoriteController')
const verifyToken = require('../middlewares/verifyToken')

router.use(verifyToken(['student']))
router.get('/', FavoriteController.getFavorites)
router.post('/', FavoriteController.saveFavorite)
router.delete('/:id', FavoriteController.removeFavorite)

module.exports = router