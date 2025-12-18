import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function ReviewPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2 mt-6">
      {/* Prev */}
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="
              flex items-center justify-center gap-2
              px-4 py-2
              rounded
              text-gray-600
              hover:bg-gray-100
              disabled:opacity-40
            "
      >
        <FaArrowLeft size={12} />
        trước
      </button>

      {/* Page numbers */}
      {Array.from({ length: totalPages }).map((_, i) => {
        const isActive = i === currentPage;

        return (
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`
              w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
              transition
              ${isActive
                ? "bg-green-700 text-white shadow"
                : "text-gray-700 hover:bg-gray-200"}
            `}
          >
            {i + 1}
          </button>
        );
      })}

      {/* Next */}
      <button
        disabled={currentPage + 1 >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="
            flex items-center justify-center gap-2
            px-4 py-2
            rounded
            text-gray-600
            hover:bg-gray-100
            disabled:opacity-40
          "
      >
        tiếp
        <FaArrowRight size={12} />
      </button>
    </div>
  );
}
