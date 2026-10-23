import React, { Suspense } from "react";
import FramerWrapper from "@/components/animation/FramerWrapper";
import { ClientSearch } from "./client-search";
import { Metadata } from "next";
import { getDictionary } from "@/dictionaries";

export const metadata: Metadata = {
  title: "blog page",
  description: 'This is a portfolio page about Evan Zhou, contain experience blog project etc.'
};

const BlogPage = async ({
  params
}: {
  params: Promise<{ lang: string; slug?: string[] }>
}) => {
  const { lang } = await params as { lang: 'en' | 'zh' };
  const dict = await getDictionary(lang as 'en' | 'zh');

  const content = dict.blog;

  return (
    <div className='lg:w-2/3 px-5 lg:px-0 mx-auto mb-20 max-w-625'>
      <div className="h-full w-full relative flex flex-col items-start gap-5 overflow-hidden">
        <div className="flex flex-col gap-3">
          <FramerWrapper y={0} x={200} className="mt-8">
            <p className=" font-poppins text-lg w-full max-sm:text-base">
             {content.subTitle}
            </p>
          </FramerWrapper>
        </div>
      </div>

      <Suspense>
        <ClientSearch lang={lang} dict={content}/>
      </Suspense>
    </div>
  );
};

export default BlogPage;