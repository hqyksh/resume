"use client";

import SectionTitle from "../SectionTitle";
import { Dictionary } from '@/types';
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';

interface BlogPost {
  id: number;
  post_title: string;
  post_date: string;
  post_content_preview?: string;
}

export default function BlogList({dict}: {dict: Dictionary}) {
  const contentLang = dict.home;
  const [lang] = useLang();
  const [books, setBooks] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  // supabase 搜索
  async function fetchBooks() {
    setLoading(true);
    try {
      const supabase = createClient();
      const query = supabase
        .from('post_previews')
        .select('*', { count: 'exact' })
        .order('post_date', { ascending: false })
        .limit(itemsPerPage);

      const { data, error } = await query;
      if (error) {
        throw error;
      }

      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="text-white lg:w-4/5 max-w-[2500px] sm:px-16 px-5 lg:px-0 mx-auto overflow-hidden mt-8 mb-8">
      <SectionTitle
        title={contentLang.title1}
        preTitle=""
        subTitle={contentLang.subTitle1}
      />

      {/* Blog 列表 - 两行，每行 3 个 */}
      <div className="bg-white/3 dark:bg-white/1 lg:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-white/[0.1] mt-8">
        {loading ? (
          <div className="col-span-full text-center py-16">
            <div className="flex justify-center items-center">
              <span className="loading loading-spinner loading-md text-gray-800 dark:text-gray-200"></span>
              <span className="ml-3 text-gray-800 dark:text-gray-200">加载中...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((blog) => (
              <Link 
                key={blog.id} 
                href={`/${lang}/blog/${blog.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="bg-gray-50/80 dark:bg-white/2 rounded-lg p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 flex items-center justify-center min-h-[45px] md:min-h-[55px]">
                  <h3 className="text-md sm:text-lg text-gray-800 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-gray-400 transition-colors line-clamp-2 text-center px-2">
                    {blog.post_title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            暂无博客文章
          </div>
        )}

        {/* 查看更多链接 */}
        <div className="flex justify-center mt-8">
          <Link 
            href={`/${lang}/blog`}
            className="text-blue-700 hover:text-blue-600 transition-colors duration-300 font-medium inline-flex items-center gap-2"
          >
            查看更多博客 →
          </Link>
        </div>
      </div>
    </div>
  );
}
