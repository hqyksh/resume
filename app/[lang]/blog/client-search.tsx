'use client';
import Image from 'next/image';
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { PenSquare } from 'lucide-react';
import ProjectCards from "@/components/ProjectsCard";
import { createClient } from "@/lib/supabase/client";
import WritePostModal from './WritePostModal';
const supabase = createClient();

export const ClientSearch = ({lang, dict}: {lang: string; dict: any}) => {
  const params = useSearchParams();
  const page = Number(params.get('page')) || 1;
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(20);
  const [inputValue, setInputValue] = useState('');
  const [writeOpen, setWriteOpen] = useState(false);
  const itemsPerPage = 15;
  // 用于取消上一次 fetch 请求
  const abortRef = useRef<AbortController | null>(null);
  // 标记是否已初始化，避免重复加载
  const initializedRef = useRef(false);

  const fetchBooks = useCallback(async (page: number) => {
    // 取消上一次请求
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    const start = (page - 1) * itemsPerPage;
    try {
      const query = supabase
        .from('post_previews')
        .select('*', { count: 'exact' })
        .order('id', { ascending: false })
        .range(start, start + itemsPerPage - 1);

      const { data, count, error } = await query;
      if (error) throw error;

      setTotalPages(Math.ceil((count || 1) / itemsPerPage));
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (page: number) => {
    // 取消上一次请求
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setLoading(true);
    const start = (page - 1) * itemsPerPage;

    if (page === 1) router.push(`/${lang}/blog`);

    if (!inputValue) {
      fetchBooks(1);
      setCurrentPage(page);
      return;
    }

    const searchParams = new URLSearchParams({
      q: inputValue,
      index: 'articles',
      offset: String(start),
      limit: String(itemsPerPage),
      attributesToHighlight: ['post_title', 'post_content'].join(','),
      attributesToCrop: ['post_content'].join(','),
      cropLength: '100',
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    });

    try {
      const data = await fetch(`/api/search?${searchParams}`, { signal });
      if (!data.ok) throw new Error(String(data.status));
      const res = await data.json();

      const res1 = res.hits.map((item: any) => ({
        ...item._formatted,
        post_content_preview: item._formatted?.post_content
      }));

      setTotalPages(Math.ceil(res.estimatedTotalHits / itemsPerPage));
      setBooks(res1);
    } catch (e: any) {
      if (e?.name !== 'AbortError') console.error(e);
    } finally {
      setLoading(false);
    }
  }, [inputValue, lang, fetchBooks, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(1);
    }
  };

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    router.push(`/${lang}/blog/?page=${newPage}`);
  }, [totalPages, lang, router]);

  // 分页渲染 - 用 useMemo 缓存
  const maxPagesToShow = 5;
  const halfMaxPages = Math.floor(maxPagesToShow / 2);
  const paginationItems = useMemo(() => {
    let startPage = 1;
    let endPage = totalPages;
    if (totalPages > maxPagesToShow) {
      if (currentPage <= halfMaxPages) {
        endPage = maxPagesToShow;
      } else if (currentPage + halfMaxPages >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
      } else {
        startPage = currentPage - halfMaxPages;
        endPage = currentPage + halfMaxPages;
      }
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [currentPage, totalPages]);

  // 只在组件首次挂载或 currentPage 变化时加载数据
  useEffect(() => {
    // 避免重复初始化
    if (initializedRef.current && currentPage === page) {
      return;
    }
    
    initializedRef.current = true;
    
    if (inputValue) {
      handleSearch(currentPage);
    } else {
      fetchBooks(currentPage);
    }
    
    // 组件卸载时取消请求
    return () => abortRef.current?.abort();
  }, [currentPage, inputValue, handleSearch, fetchBooks, page]);

  return (
    <div className='mt-8 text-black dark:text-white'>
      <div className="flex justify-end w-full gap-2 mb-8">
        <Input type="text" placeholder="Search..." value={inputValue} onKeyDown={handleKeyDown} className="!ring-blue-500 w-[280px]" onChange={handleInputChange} />
        <Button type="submit" variant="outline" className="cursor-pointer active:bg-gray-400" onClick={() => handleSearch(1)}>
          {dict?.buttons.search}
        </Button>
        <Button className="cursor-pointer gap-1.5" onClick={() => setWriteOpen(true)}>
          <PenSquare size={16} />
          {dict?.buttons.write}
        </Button>
      </div>
      
      {loading ? (
        <div className="w-full text-center h-[350px] pt-16"><span className="loading loading-spinner loading-xl"></span></div>
      ) : (
        books.length ? (
          <div className="md:flex w-full min-h-[280px] flex-row flex-wrap">
            {books.map((val, indx) => (
              <ProjectCards key={indx} value={val} num={indx} dict={dict}/>
            ))}
          </div>
        ) : (
          <div className="min-h-70 pt-16 flex flex-col items-center">
            <Image src="/icons/empty1.svg" width={180} height={100} alt="" className='mb-5'/>
            {dict?.buttons.result}
          </div>
        )
      )}

      <Pagination className="mt-16">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink onClick={() => handlePageChange(currentPage - 1)} className="cursor-pointer px-3 py-2 w-auto">
              {dict?.buttons?.pre}
            </PaginationLink>
          </PaginationItem>
          {currentPage > halfMaxPages && (
            <PaginationItem><PaginationEllipsis>...</PaginationEllipsis></PaginationItem>
          )}
          {paginationItems.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                onClick={() => handlePageChange(p)}
                isActive={currentPage === p}
                className={`cursor-pointer ${currentPage === p ? 'text-gray-800' : ''}`}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage < totalPages - halfMaxPages && (
            <PaginationItem><PaginationEllipsis>...</PaginationEllipsis></PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink onClick={() => handlePageChange(currentPage + 1)} className="cursor-pointer px-3 py-2 w-auto">
              {dict?.buttons.next}
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <WritePostModal
        open={writeOpen}
        dict={dict?.writeModal}
        onClose={() => setWriteOpen(false)}
        onSuccess={() => fetchBooks(currentPage)}
      />
    </div>
  );
}
