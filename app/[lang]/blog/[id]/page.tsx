import React from "react";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
  );
}

export async function generateMetadata({ params } : { params: Promise<{id: string}>}) {
  const resolvedParams = await params;
  const supabase = getSupabase();
  
  const { data, error } = await supabase
  .from('wp_posts')
  .select('post_title')
  .eq('id', resolvedParams.id)
  .single(); 

  if (error || !data) {
    return {
      title: 'Not Found',
      description: 'The requested post could not be found.',
    };
  }

  return {
    title: data.post_title,
    description: data.post_title,
  };
}

const ArticleDetail = async ({ params } : { params: Promise<{id: string}>}) => {
  const resolvedParams = await params;
  const supabase = getSupabase();
  const { data: detail, error } = await supabase
    .from('wp_posts')
    .select('*')
    .eq('id', resolvedParams.id)
    .single(); 

  if (error || !detail) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 lg:w-2/3 px-8 lg:px-0">
      <div className="shadow-md rounded-lg border-t-2 border-gray-100 overflow-hidden text-black min-h-screen dark:bg-transparent dark:text-white dark:border-2 dark:border-white/[0.1]">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{detail.post_title}</h1>
          <div className="text-gray-600 text-sm mb-4">
            <span>{detail.post_date}</span>
          </div>
          <div
            className="leading-8 post_content min-h-[80vh]"
            dangerouslySetInnerHTML={{ __html: detail.post_content }}
          />
          </div>
      </div>
    </div>
  );
};

export default ArticleDetail;