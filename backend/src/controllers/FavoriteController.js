const Favorite = require('../models/Favorite')
const Project = require('../models/Project')
const Student = require('../models/Student')
const Employer = require('../models/Employer')

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

      // Lấy danh sách project còn tồn tại
      const existingProjects = await Project.find({}).select('_id')
      const existingProjectIds = new Set(existingProjects.map(p => p._id.toString()))

      const favorites = await Favorite.find({ account: accountId })
        .populate({
          path: 'project',
          select: '-__v',
          populate: { path: 'account', select: 'role avatar' }
        })
        .sort({ createdAt: -1 })

      // Lọc ra các favorite có project tồn tại trong project data
      const validFavorites = favorites.filter(
        fav => fav.project && existingProjectIds.has(fav.project._id.toString())
      )

      const favoritesWithProfile = await Promise.all(
        validFavorites.map(async (fav) => {
          const project = fav.project
          let profile = null
          if (project && project.account) {
            if (project.account.role === 'student') {
              const student = await Student.findOne({ account: project.account._id }).select('name')
              profile = student ? { name: student.name } : null
            } else if (project.account.role === 'employer') {
              const employer = await Employer.findOne({ account: project.account._id }).select('companyName')
              profile = employer ? { companyName: employer.companyName } : null
            }
          }
          return {
            ...fav.toObject(),
            project: {
              ...project.toObject(),
              profile
            }
          }
        })
      )

      res.status(200).json(favoritesWithProfile)
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