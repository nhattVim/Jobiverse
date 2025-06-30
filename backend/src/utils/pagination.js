/**
 * Create pagination object for MongoDB queries
 * @param {Object} query - Express request query object
 * @param {Object} options - Additional options
 * @param {number} options.defaultPage - Default page number (default: 1)
 * @param {number} options.defaultLimit - Default items per page (default: 10)
 * @returns {Object} Pagination configuration object
 */
const getPagination = (query, options = {}) => {
  const page = Math.max(1, parseInt(query.page) || options.defaultPage || 1)
  const limit = Math.max(1, parseInt(query.limit) || options.defaultLimit || 10)
  const skip = (page - 1) * limit

  return {
    page,
    limit,
    skip
  }
}

/**
 * Create pagination metadata
 * @param {number} total - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
const getPaginationMetadata = (total, page, limit) => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
  }
}

/**
 * Create paginated response
 * @param {Array} data - Array of items for current page
 * @param {number} total - Total number of items
 * @param {Object} pagination - Pagination configuration from getPagination
 * @returns {Object} Formatted response with data and pagination metadata
 */
const paginatedResponse = (data, total, pagination) => {
  return {
    data,
    pagination: getPaginationMetadata(total, pagination.page, pagination.limit)
  }
}

module.exports = {
  getPagination,
  getPaginationMetadata,
  paginatedResponse
}
