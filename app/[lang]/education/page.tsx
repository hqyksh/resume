import React from "react";
import Image from "next/image";
import FramerWrapper from "@/components/animation/FramerWrapper";
import { Metadata } from "next";
import { getDictionary } from '@/dictionaries/index';
import { SchoolImage } from "./schoolImage";

export const metadata: Metadata = {
  title: "education page",
  description: 'This is a portfolio page about Eric Zhou, contain experience blog project etc.'
};

const EducationPage = async ({
  params
}: {
  params: Promise<{ lang: string; slug?: string[] }>
}) => {
  const { lang } = await params as { lang: 'en' | 'zh' };
  const dict = await getDictionary(lang as 'en' | 'zh');

  const content = dict.education;

  return (
    <div className="lg:w-2/3 px-5 lg:px-0 mx-auto min-h-[calc(100vh-100px)]">
      <div className="flex flex-col gap-3 mb-10">
        <FramerWrapper y={0} x={200} className="mt-8">
          <p className="font-poppins text-lg w-full max-sm:text-base flex items-center gap-2">
            {/* <Image 
              src="/school/scnydxlogo.png" 
              alt="School Logo"
              width={35} 
              height={35}
              className="w-8 h-8 bg-[#ffffff] rounded-[100%]"
            /> */}
            {content.subTitle}
          </p>
        </FramerWrapper>
      </div>

      <div className="flex xl:flex-row flex-col xl:gap-10 gap-0">
        <div className="leading-8 flex-1 xl:order-1 order-2 text-black dark:text-white">
          {content.description}
          <dl className="mt-8">
            <dt className="font-bold">
               {content.certificate}
            </dt>
            <dd className="mt-2"><span className="inline-block dark:bg-gray-800/[0.2] bg-gray-800/[0.1] rounded-2xl px-4">1、{content.certificateItem[0]}</span></dd>
            <dd className="mt-2"><span className="inline-block dark:bg-gray-800/[0.2] bg-gray-800/[0.1] rounded-2xl px-4">2、{content.certificateItem[1]}</span></dd>
          </dl>
        </div>
        <div className="flex-2 xl:order-2 order-1 xl:mb-0 mb-10">
          <SchoolImage />
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
