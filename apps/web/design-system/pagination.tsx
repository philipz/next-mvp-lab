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

  return (
    <nav aria-label="Page navigation" className="flex justify-center my-4">
      <ul className="flex items-center gap-2">
        <li>
          <button
            onClick={handleFirst}
            disabled={isFirstPage}
            aria-disabled={isFirstPage}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors"
          >
            First
          </button>
        </li>
        <li>
          <button
            onClick={handlePrevious}
            disabled={isFirstPage}
            aria-disabled={isFirstPage}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors"
          >
            Previous
          </button>
        </li>
        <li>
          <span className="px-4 py-2 text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
        </li>
        <li>
          <button
            onClick={handleNext}
            disabled={isLastPage}
            aria-disabled={isLastPage}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        </li>
        <li>
          <button
            onClick={handleLast}
            disabled={isLastPage}
            aria-disabled={isLastPage}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors"
          >
            Last
          </button>
        </li>
      </ul>
    </nav>
  )
}
