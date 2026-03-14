import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, disabled }) => {
  const maxVisiblePages = 5;
  
  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || disabled}
      >
        First
      </button>
      
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
      >
        Previous
      </button>
      
      {getPageNumbers().map(pageNum => (
        <button
          key={pageNum}
          className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
          onClick={() => onPageChange(pageNum)}
          disabled={disabled}
        >
          {pageNum}
        </button>
      ))}
      
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
      >
        Next
      </button>
      
      <button
        className="pagination-btn"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || disabled}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;