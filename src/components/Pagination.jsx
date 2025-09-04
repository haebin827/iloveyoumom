import React from 'react';
import '../assets/styles/Pagination.css';
import {MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdOutlineKeyboardArrowLeft} from "react-icons/md";

function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  maxVisiblePages = 5
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages = [];
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      
      if (currentPage <= halfVisible) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + halfVisible >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  return (
    <div className="pagination-container">
      {showInfo && (
        <div className="pagination-info">
          {totalItems}개 중 {startItem}-{endItem}개 표시
        </div>
      )}

      <div className="pagination-controls">
        <button
          className="pagination-button pagination-prev"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <MdOutlineArrowBackIos />
        </button>

        {visiblePages[0] > 1 && (
          <>
            <button
              className="pagination-button pagination-page"
              onClick={() => handlePageClick(1)}
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="pagination-ellipsis">...</span>
            )}
          </>
        )}

        {visiblePages.map(page => (
          <button
            key={page}
            className={`pagination-button pagination-page ${
              page === currentPage ? 'active' : ''
            }`}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="pagination-ellipsis">...</span>
            )}
            <button
              className="pagination-button pagination-page"
              onClick={() => handlePageClick(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          className="pagination-button pagination-next"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <MdOutlineArrowForwardIos />
        </button>
      </div>
    </div>
  );
}

export default Pagination;