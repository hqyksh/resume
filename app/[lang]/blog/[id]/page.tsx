import React from "react";
import BlogDetailClient from "./BlogDetailClient";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params } : { params: Promise<{id: string}>}) {
  const resolvedParams = await params;
  try {
    const supabase = await createClient();
    const { data: post } = await supabase
      .from('wp_posts')
      .select('post_title')
      .eq('id', resolvedParams.id)
      .single();
    return {
      title: post?.post_title ?? '文章详情',
      description: '博客文章详情',
    };
  } catch {
    return {
      title: `文章 ${resolvedParams.id}`,
      description: '博客文章详情',
    };
  }
}

const ArticleDetail = async ({ params } : { params: Promise<{id: string}>}) => {
  const resolvedParams = await params;
  return <div className="min-h-screen flex"><BlogDetailClient id={resolvedParams.id} /></div>;
};

export default ArticleDetail;
