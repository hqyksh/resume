import React from 'react'
import FramerWrapper from "@/components/animation/FramerWrapper";
import Heading from "@/components/Heading";
import project from '@/content/project.json';
import { Metadata } from "next";
import Slide from './slide';
import LocaleLink from '@/components/LocaleLink';
import Image from 'next/image';
import { getDictionary } from '@/dictionaries';

export const metadata: Metadata = {
  title: "project page",
  description: 'This is a portfolio page about Ethen Zhou, contain experience blog project etc.'
};

const ProjectPage = async ({
  params
}: {
  params: Promise<{ lang: string; slug?: string[] }>
}) => {
  const { lang } = await params as { lang: 'en' | 'zh' };
  const dict = await getDictionary(lang as 'en' | 'zh');

  const navLinks = dict.navLink;
  const path = navLinks.find((item: { path: string; }) => item.path === '/project')
  const content = dict.project;
  
  return (
    <div className="lg:w-2/3 px-5 lg:px-0 mx-auto mb-15">
       <div className="flex flex-col gap-3 mb-10">
        <Heading>{path?.title}</Heading>
        <FramerWrapper y={0} x={200}>
          <p className="font-poppins text-lg w-full max-sm:text-base">
            {content.subTitle}
          </p>
        </FramerWrapper>
      </div>

      <ul className="timeline timeline-snap-icon timeline-compact timeline-vertical mb-16">
        {
          project.map((item, index) => {
            return (
              <li key={index} className="text-black dark:text-white">
                <div id={item.linkId} className='mt-[-200]'></div>
                <div className="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="timeline-end mb-10">
                  {
                    item.url ? <div className="font-bold text-lg text-gray-600"><LocaleLink href={item.url} target='_blank'>{item.company}</LocaleLink></div> : <div className="font-bold text-lg text-gray-600">{item.company}</div>
                  }
                  <div className="text-2xl">{item.title}</div>
                
                  <div className='mt-2'>{item.description}</div>
                  
                  {
                    item.zhize.length ? <div className="mt-5 text-lg">
                      <div className="font-bold pt-2 text-gray-600 text-xl">{content.job}</div>
                      { Array.isArray(item.zhize) ? 
                        <ul>
                          {
                            item.zhize.length ? item.zhize.map((zz, index) => {
                              return <li key={index}>{zz}</li>
                            }) : null
                          }
                        </ul> : item.zhize
                      }
                    </div> : null
                  }
                  

                  {
                    item.result.length ? <div className="mt-5">
                    <div className="font-bold pt-2 text-gray-600 text-xl">{content.result}</div>
                    { Array.isArray(item.result) ? 
                      <ul>
                        {
                          item.result.length ? item.result.map((rt, index) => {
                            return <li key={index}>{rt}</li>
                          }) : null
                        }
                      </ul> : item.result
                    }
                  </div> : null
                  }

                  {
                    item.images.length ? <div className="mt-5 ml-12">
                      <Slide images={item.images} />
                    </div> : null
                  }
                  
                  {
                    item.stack.length ? <div className="mt-5">
                    <div className="font-bold pt-2 text-gray-600 text-xl">{content.skill}</div>
                    <div className="flex gap-10 py-4 pb-8 flex-wrap">
                        {item.stack.map((st, index) => {
                          return <div key={index}>
                            { st.icon ? <Image
                              width={28}
                              height={28}
                              className='md:w-8 h-8 mx-auto'
                              src={st.icon}
                              alt={st.name} /> : null}
                            <p>{st.name}</p>
                          </div>
                        })}
                      </div>
                  </div> : null
                  }
                  
                </div>
                <hr />
              </li>
            )
          })
        }
        
      </ul>
    </div>
  );
};

export default ProjectPage;
