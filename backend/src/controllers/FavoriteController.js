const Favorite = require('../models/Favorite')
const Project = require('../models/Project')

class FavoriteController {
  // [POST] /favorites
  async saveFavorite(req, res, next) {
    try {
      const accountId = req.account._id
      const { projectId } = req.body

      const project = await Project.findById(projectId)
      if (!project) {
        return res.status(404).json({ message: 'Project not found' })
      }

      const existingFavorite = await Favorite.findOne({ account: accountId, project: projectId })
      if (existingFavorite) {
        return res.status(400).json({ message: 'This project is already in your favorites' })
      }

      const favorite = await Favorite.create({ account: accountId, project: projectId })
      res.status(201).json({ message: 'Project saved to favorites successfully', favorite })
    } catch (err) {
      res.status(500).json({ message: 'Error saving favorite', error: err.message })
    }
  }

  // [GET] /favorites
  async getFavorites(req, res, next) {
    try {
      const accountId = req.account._id

      const favorites = await Favorite.find({ account: accountId })
        .populate('project', '-__v')
        .sort({ createdAt: -1 })

      res.status(200).json(favorites)
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving favorites', error: err.message })
    }
  }

  // [DELETE] /favorites/:id
  async removeFavorite(req, res, next) {
    try {
      const accountId = req.account._id
      const { id } = req.params

      const deletedFavorite = await Favorite.findOneAndDelete({ account: accountId, project: id })
      if (!deletedFavorite) {
        return res.status(404).json({ message: 'Favorite not found' })
      }

      res.status(200).json({ message: 'Favorite removed successfully' })
    } catch (err) {
      res.status(500).json({ message: 'Error removing favorite', error: err.message })
    }
  }
}

module.exports = new FavoriteController()