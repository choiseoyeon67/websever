// src/components/common/Pagination.jsx
function Pagination({ currentPage, totalPage, onPageChange }) {
  return (
    <div className='flex gap-2 justify-center mt-8'>
      {Array.from({ length: totalPage }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`px-4 py-2 border rounded ${
            currentPage === index + 1 ? 'bg-black text-white' : 'bg-white'
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  )
}

export default Pagination;