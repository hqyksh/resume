import React from 'react';
import Image from 'next/image';
import FramerWrapper from "@/components/animation/FramerWrapper";
import Heading from "@/components/Heading";
import { Metadata } from "next";
import LocaleLink from '@/components/LocaleLink';
import { getDictionary } from '@/dictionaries';
import experienceList from '@/content/experience.json';

export const metadata: Metadata = {
  title: "project page",
  description: 'This is a portfolio page about Eric Zhou, contain experience blog project etc.'
};

const ExperiencePage = async ({
  params
}: {
  params: Promise<{ lang: string; slug?: string[] }>
}) => {
    const { lang } = await params as { lang: 'en' | 'zh' };
    const dict = await getDictionary(lang as 'en' | 'zh');
  
    const navLinks = dict.navLink;
    const path = navLinks.find((item: { path: string; }) => item.path === '/experience')
    const content = dict.experience;
    
  return (
    <div className='lg:w-2/3 px-5 lg:px-0 mx-auto mb-15'>
      <div className="flex flex-col gap-3 mb-10">
        <Heading>{path?.title}</Heading>
        <FramerWrapper y={0} x={200}>
          <p className=" font-poppins text-lg w-full max-sm:text-base">
            {content.subTitle}
          </p>
        </FramerWrapper>
      </div>

      <div className='mt-10 sm:grid sm:grid-cols-2 md:grid-cols-3 gap-8'>
      {
        experienceList.map((item, index) => {
           return <LocaleLink key={index} href={`/experience/${item.id}?modal=true`}>
            <div className="card bg-base-100 shadow-sm text-gray-800 h-[405px] mb-4 md:mb-0">
              <figure className="relative h-[250px]">
                <Image
                  fill
                  className='object-bottom object-cover'
                  src={item.logo}
                  alt={item.title}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{item.title}</h2>
                <p className="">{item.industry}</p>
                <p className="font-bold">{item.job}</p>
                <p className="">{item.time}</p>
              </div>
            </div>
          </LocaleLink>
        })
      }
      </div>
    </div>
  )
}

export default ExperiencePage
