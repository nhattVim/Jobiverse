const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  // Hiển thị tối đa 5 nút trang, có ... nếu nhiều trang
  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, '...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, '...', currentPage, '...', totalPages)
    }
    return pages
  }

  return (
    <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
      {/* Prev button */}
      <button
        type="button"
        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-white-mid focus:z-20 focus:outline-offset-0 disabled:opacity-50 cursor-pointer"
        aria-label="Previous"
        disabled={currentPage === 1}
        onClick={handlePrev}
      >
        <span className="sr-only">Previous</span>
        <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
      </button>
      {/* Page numbers */}
      {getPageNumbers().map((page, idx) =>
        page === '...'
          ? <span key={idx} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0">...</span>
          : <button
            key={page + '-' + idx}
            type="button"
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0 cursor-pointer ${page === currentPage ? 'z-10 bg-blue text-white ring-blue' : 'text-black hover:bg-white-mid ring-gray-300'}`}
            aria-current={page === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
          >
            {page}
          </button>
      )}
      {/* Next button */}
      <button
        type="button"
        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-white-mid focus:z-20 focus:outline-offset-0 disabled:opacity-50 cursor-pointer"
        aria-label="Next"
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        <span className="sr-only">Next</span>
        <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>
    </nav>
  )
}

export default Pagination