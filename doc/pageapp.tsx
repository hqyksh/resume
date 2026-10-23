import React from 'react'
import Hello from "@/components/hello/index";
import RecentProject from '@/components/hello//recentProject';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Evan Zhou's portfolio page",
  description: 'This is a portfolio page about Evan Zhou, contain experience blog project etc.'
};

export default function Home() {
  return (
    <>
      <Hello />
      <RecentProject />
    </>
  );
}
