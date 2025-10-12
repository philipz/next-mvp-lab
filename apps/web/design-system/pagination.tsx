export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  const handleFirst = () => {
    if (!isFirstPage) {
      onPageChange(1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1)
    }
  }

  const handleLast = () => {
    if (!isLastPage) {
      onPageChange(totalPages)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  return (
    <nav aria-label="Page navigation" className="flex justify-center my-4">
      <ul className="flex items-center gap-2">
        <li>
          <button
            onClick={handleFirst}
            onKeyDown={(e) => handleKeyDown(e, handleFirst)}
            disabled={isFirstPage}
            aria-disabled={isFirstPage}
            aria-label={`Go to first page`}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors"
          >
            First
          </button>
        </li>
        <li>
          <button
            onClick={handlePrevious}
            onKeyDown={(e) => handleKeyDown(e, handlePrevious)}
            disabled={isFirstPage}
            aria-disabled={isFirstPage}
            aria-label={`Go to previous page (page ${currentPage - 1})`}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors"
          >
            Previous
          </button>
        </li>
        <li>
          <span className="px-4 py-2 text-sm font-medium text-gray-700" aria-current="page">
            Page {currentPage} of {totalPages}
          </span>
        </li>
        <li>
          <button
            onClick={handleNext}
            onKeyDown={(e) => handleKeyDown(e, handleNext)}
            disabled={isLastPage}
            aria-disabled={isLastPage}
            aria-label={`Go to next page (page ${currentPage + 1})`}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        </li>
        <li>
          <button
            onClick={handleLast}
            onKeyDown={(e) => handleKeyDown(e, handleLast)}
            disabled={isLastPage}
            aria-disabled={isLastPage}
            aria-label={`Go to last page (page ${totalPages})`}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors"
          >
            Last
          </button>
        </li>
      </ul>
    </nav>
  )
}
