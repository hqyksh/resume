import React from "react";
import BlogDetailClient from "./BlogDetailClient";

export async function generateMetadata({ params } : { params: Promise<{id: string}>}) {
  const resolvedParams = await params;
  return {
    title: `文章 ${resolvedParams.id}`,
    description: '博客文章详情',
  };
}

const ArticleDetail = async ({ params } : { params: Promise<{id: string}>}) => {
  const resolvedParams = await params;
  return <div className="min-h-screen flex"><BlogDetailClient id={resolvedParams.id} /></div>;
};

export default ArticleDetail;
