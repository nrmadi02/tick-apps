import React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { usePagination } from "~/hooks/use-pagination";

interface PaginationProps {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  className?: string;
}

const PaginationTable: React.FC<PaginationProps> = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // if (currentPage === 0 || paginationRange.length < 2) {
  //   return null;
  // }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="flex justify-end">
      <Pagination className="mt-5 justify-end">
        <PaginationContent className="justify-end">
          <PaginationItem>
            <PaginationPrevious
              disabled={currentPage === 1}
              role="button"
              onClick={onPrevious}
            />
          </PaginationItem>
          {paginationRange.map((pageNumber, index) => (
            <PaginationItem key={index}>
              {pageNumber.isDots ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  className="mt-0"
                  isActive={pageNumber.value === currentPage}
                  onClick={() => onPageChange(pageNumber.value as number)}
                >
                  {pageNumber.value}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              disabled={currentPage === lastPage?.value}
              role="button"
              onClick={onNext}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationTable;
