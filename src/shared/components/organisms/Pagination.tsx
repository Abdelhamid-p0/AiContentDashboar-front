import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/atoms/Button";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const currentPage = Math.min(page + 1, safeTotalPages);
  const [inputValue, setInputValue] = useState(String(currentPage));

  useEffect(() => {
    setInputValue(String(currentPage));
  }, [currentPage]);

  const visiblePages = useMemo((): Array<number | "ellipsis"> => {
    if (safeTotalPages <= 7) {
      return Array.from({ length: safeTotalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis", safeTotalPages];
    }

    if (currentPage >= safeTotalPages - 3) {
      return [
        1,
        "ellipsis",
        safeTotalPages - 4,
        safeTotalPages - 3,
        safeTotalPages - 2,
        safeTotalPages - 1,
        safeTotalPages,
      ];
    }

    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      safeTotalPages,
    ];
  }, [currentPage, safeTotalPages]);

  const clampPage = (value: number) =>
    Math.min(Math.max(value, 0), safeTotalPages - 1);

  const commitPage = (raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= safeTotalPages) {
      onPageChange(clampPage(parsed - 1));
      setInputValue(String(parsed));
    } else {
      setInputValue(String(currentPage));
    }
  };

  return (
    <div className="pagination">
      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-icon"
          onClick={() => onPageChange(clampPage(page - 1))}
          disabled={page <= 0}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {visiblePages.map((value, index) =>
          value === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={value}
              type="button"
              className={`pagination-button${
                value === currentPage ? " is-active" : ""
              }`}
              onClick={() => onPageChange(clampPage(value - 1))}
              aria-label={`Go to page ${value}`}
            >
              {value}
            </button>
          ),
        )}

        <button
          type="button"
          className="pagination-icon"
          onClick={() => onPageChange(clampPage(page + 1))}
          disabled={page >= safeTotalPages - 1}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="pagination-jump">
        <span>Go to page</span>
        <input
          className="pagination-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onChange={(event) =>
            setInputValue(event.target.value.replace(/[^0-9]/g, ""))
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              commitPage(inputValue);
            }
          }}
          aria-label="Page number"
        />
        <span>/ {safeTotalPages}</span>
        <Button
          type="button"
          className="pagination-confirm"
          onClick={() => commitPage(inputValue)}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
