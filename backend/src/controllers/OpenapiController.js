class OpenapiController {
  // GET /locations
  async getLocations(req, res, next) {
    console.log('Start fetching provinces')
    try {
      const response = await fetch('https://provinces.open-api.vn/api?depth=3')
      if (!response.ok) throw new Error(`External API error: ${response.status} ${response.statusText}`)
      const data = await response.json()
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching provinces' })
    }
  }
}

module.exports = new OpenapiController()
