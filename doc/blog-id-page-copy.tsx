import React, { useState, useEffect } from "react";

import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
const supabase = await createClient();


// 获取服务器端数据
export async function getServerSideProps({ params }:{ params: any}) {
  try {
    const { data, error } = await supabase
      .from('wp_posts')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        detail: data,
      },
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      notFound: true,
    };
  }
}

// 生成元数据
export async function generateMetadata({ params, props } : { params: any, props: any }) {
  const { detail } = props;

  if (!detail) {
    return {
      title: 'Not Found',
      description: 'The requested post could not be found.',
    };
  }

  return {
    title: detail.post_title,
    description: detail.post_excerpt,
  };
}

const ArticleDetail: React.FC<any> = ({  }) => {
  const params = useParams();
  const [detail, setDetail] = useState<any[]>([]);
  const fetchBooks = async () => {
    const { data, error } = await supabase
    .from('wp_posts')
    .select('*')
    .eq('id', params.id)
    .single(); 

    if (error) {
        throw error
    }

    setDetail(data);
  }

  useEffect(() => {
    fetchBooks()
  }, []);


  return (
    <div className="container mx-auto py-8 lg:w-2/3 px-8 lg:px-0">
      <div className="shadow-md rounded-lg overflow-hidden text-white bg-gray-800 min-h-screen">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{detail.post_title}</h1>
          <div className="text-gray-600 text-sm mb-4">
            <span>{detail.post_date}</span>
          </div>
          <div
            className="leading-8"
            dangerouslySetInnerHTML={{ __html: detail.post_content }}
          />
          </div>
      </div>
    </div>
  );
};

export default ArticleDetail;