"use client";

import { useEffect } from "react";
import { motion as m, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Badges from "./badge";
import Image from "next/image";

export default function FeaturedProject({ content, contentLang, index }: {
  content: any;
  contentLang: any;
  index: number;
}) {
  const {
    tools,
    framework,
    programming
  } = content;
  
  const {
    programmingTitle,
    frameworkTitle,
    toolsTitle,
    project,
    descriptionTitle
  } = contentLang;

  const controls = useAnimation();
// 1. triggerOnce: false → true，避免每次滚动都重新触发动画
  const { ref, inView } = useInView({
    threshold: 0.25,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
    if (!inView) {
      controls.start("hidden");
    }
  }, [controls, inView]);

  return (
    <div
      className="relative flex lg:rounded-2xl border border-gray-200 bg-gray-50/[0.8] dark:border-white/[0.1] dark:bg-white/[0.02] text-black dark:text-white pt-5 sm:px-10 px-5"
    >
      <div className="flex flex-col gap-2 shrink pb-10">
        <div className=" gap-2 min-h-4/5">
        
          <div className="block xl:hidden">
            <div className="flex items-center gap-2">
              <div className="text-2xl mb-2">{project}</div>
            </div>
            <div className="lg:text-3xl text-xl">
              <p>
                {descriptionTitle}
              </p>
            </div>

            <Image
              width={1920}
              height={868}
              alt="school view"
              style={{ objectFit: 'fill' }} 
              src="/project/1.jpg"
              className="w-full h-full object-contain object-center mt-4"
            />
          </div>
          
          <div className="flex1">
            <div className="mt-8 lg:mt-4">
              <div className="text-2xl mb-5">{programmingTitle}</div>
              <Badges
                list={programming}
                block="stack"
                fullContainer={false}
                color={false}
              />
            </div>

            <div className="mt-8">
              <div className="text-2xl mb-5">{frameworkTitle}</div>
              <Badges
                list={framework}
                block="stack"
                fullContainer={false}
                color={false}
              />
            </div>

            <div className="mt-8">
              <div className="text-2xl mb-5">{toolsTitle}</div>
              <Badges
                list={tools}
                block="stack"
                fullContainer={false}
                color={false}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const container = {
  hidden: {
    transition: {
      delayChildren: 0.125,
      staggerChildren: 0.0625,
    },
  },
  visible: {
    transition: {
      delayChildren: 0.125,
      staggerChildren: 0.25,
    },
  },
  rest: {
    transition: {
      delayChildren: 0,
      staggerChildren: 0,
    },
  },
  hover: {
    transition: {
      delayChildren: 0,
      staggerChildren: 0,
    },
  },
};