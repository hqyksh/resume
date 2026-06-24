import React from 'react'
import Hello from "@/components/hello/index";
import RecentProject from '@/components/hello/recentProject';
import BlogList from '@/components/hello/blogList';
import { Metadata } from 'next';
import { getDictionary } from "@/dictionaries";

export const metadata: Metadata = {
  title: "Eric Zhou's portfolio page",
  description: 'This is a portfolio page about Eric Zhou, contain experience blog project etc.'
};

export default async function Home({params}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params as { lang: 'en' | 'zh' };
  const dict = await getDictionary(lang as 'en' | 'zh');
  
  return (
    <>
      <Hello dict={dict}/>
      <BlogList dict={dict}/>
      <RecentProject dict={dict}/>
    </>
  );
}
