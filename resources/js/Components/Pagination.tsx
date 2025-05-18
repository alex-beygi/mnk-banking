import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Helper to generate the page numbers to display
  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const maxPageNumber = totalPages;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show the first page
      pages.push(1);

      // Show pages around the current page
      const startPage = Math.max(currentPage - 2, 2);
      const endPage = Math.min(currentPage + 2, maxPageNumber - 1);

      // Add a "..." before the current page's range if there are more than two pages before it
      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add a "..." after the current page's range if there are more than two pages after it
      if (endPage < maxPageNumber - 1) {
        pages.push('...');
      }

      // Always show the last page
      pages.push(maxPageNumber);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav className="flex justify-center mt-6">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${
              currentPage === 1 && 'opacity-50 cursor-not-allowed'
            }`}
          >
            Prev
          </button>
        </li>

        {generatePageNumbers().map((number, index) =>
          number === '...' ? (
            <li key={index}>
              <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">
                ...
              </span>
            </li>
          ) : (
            <li key={number}>
              <button
                onClick={() => handlePageChange(Number(number))}
                className={`px-3 py-2 leading-tight ${
                  currentPage === number
                    ? 'text-white bg-blue-500 border-blue-500'
                    : 'text-gray-500 bg-white border border-gray-300'
                } hover:bg-gray-100 hover:text-gray-700`}
              >
                {number}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${
              currentPage === totalPages && 'opacity-50 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
