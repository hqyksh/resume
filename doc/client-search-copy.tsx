'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import ProjectCards from "@/components/ProjectsCard";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient(); // 注意：createClient 是同步函数，不需要 await

export const ClientSearch =  ({ page }: { page: number }) => {
  const dd = useSearchParams();
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages] = useState(20);
  const itemsPerPage = 15;

  const fetchBooks = async (page: number) => {
    setLoading(true)
    const start = (page - 1) * itemsPerPage;
    try {
      const { data, error } = await supabase
        .from('post_previews')
        .select('*')
        .order('post_date', { ascending: false })
        .range(start, start + itemsPerPage - 1);

      if (error) {
        throw error;
      }

      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    router.push(`/blog/?page=${newPage}`);
  };


  const maxPagesToShow = 5;
  const halfMaxPages = Math.floor(maxPagesToShow / 2);

  const renderPaginationItems = () => {
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxPagesToShow) {
      if (currentPage <= halfMaxPages) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + halfMaxPages >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfMaxPages;
        endPage = currentPage + halfMaxPages;
      }
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    return pages;
  };

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  return (
    <div className='mt-8'>
      {loading ? (
        <div className="w-full text-center h-[200px] pt-16"><span className="loading loading-spinner loading-xl"></span></div>
      ) : (
        <div className="w-full flex flex-row flex-wrap gap-3 max-lg:flex-col">
          {books.map((val, indx) => {
            return <ProjectCards key={indx} value={val} num={indx} />;
          })}
        </div>
      )}
      <Pagination className="mt-16">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className="cursor-pointer"
              >
             Previous
            </PaginationPrevious>
          </PaginationItem>
          {currentPage > halfMaxPages && (
            <PaginationItem>
              <PaginationEllipsis>...</PaginationEllipsis>
            </PaginationItem>
          )}
          {renderPaginationItems().map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
                className={`cursor-pointer ${currentPage === page ? 'text-gray-800' : ''}`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage < totalPages - halfMaxPages && (
            <PaginationItem>
              <PaginationEllipsis>...</PaginationEllipsis>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              aria-disabled={currentPage === totalPages}
              className="cursor-pointer"
            >
              Next
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
