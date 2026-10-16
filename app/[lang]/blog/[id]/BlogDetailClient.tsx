'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createClient } from '@/lib/supabase/client';

type Post = {
  id: number;
  post_title: string;
  post_date: string;
  post_content: string;
  is_markdown?: boolean;
};

const BlogDetailClient = ({ id }: { id: string }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'notfound'>('loading');

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    setStatus('loading');

    supabase
      .from('wp_posts')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setStatus('notfound');
        } else {
          setPost(data as Post);
          setStatus('ready');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto py-24 lg:w-2/3 px-8 lg:px-0 text-center">
        <span className="loading loading-spinner loading-lg text-gray-500"></span>
      </div>
    );
  }

  if (status === 'notfound' || !post) {
    return (
      <div className="container mx-auto py-24 lg:w-2/3 px-8 lg:px-0 text-center text-gray-500">
        404
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 lg:w-2/3 px-8 lg:px-0">
      <div className="shadow-md rounded-lg border-t-2 border-gray-100 overflow-hidden text-black min-h-screen dark:bg-transparent dark:text-white dark:border-2 dark:border-white/[0.1]">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{post.post_title}</h1>
          <div className="text-gray-600 text-sm mb-4">
            <span>{post.post_date}</span>
          </div>
          {post.is_markdown ? (
            <div className="prose dark:prose-invert max-w-none min-h-[80vh]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.post_content}</ReactMarkdown>
            </div>
          ) : (
            <div
              className="leading-8 post_content min-h-[80vh]"
              dangerouslySetInnerHTML={{ __html: post.post_content }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailClient;
