"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import Image from 'next/image';
import experienceList from '@/content/experience.json'
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import LocaleLink from '@/components/LocaleLink';
import FramerWrapper from "@/components/animation/FramerWrapper";
import Heading from "@/components/Heading";

import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getDictionary } from "@/dictionaries";

export default function ProjectDetailPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const p = experienceList.find(item => item.id == Number(params.id))!

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  useEffect(() => {
    async function fetchData() {
      const lang = params.lang as 'en' | 'zh';
      const dict = await getDictionary(lang);
      const content = dict.experienceDetail;
      setData(content);
    }

    fetchData();
  }, [params.lang])

  return (
    <div className="lg:w-3/5 lg:px-0 xl:w-2/3 mx-auto mb-15 pt-5 px-5 text-black dark:text-white " onClick={e => e.stopPropagation()}>
      <div className="flex flex-col gap-3">
        <Heading>{data?.subTitle}</Heading>
        <FramerWrapper y={0} x={200}>
          <p className=" font-poppins text-lg w-full max-sm:text-base">
            {p.title}
          </p>
        </FramerWrapper>
      </div>

      <div className="block sm:flex justify-end pb-8 pr-2 mt-4 sm:-mt-5">
        <LocaleLink href={`/project#${p.link}`}
          className={cn(
            buttonVariants({
              variant: "default",
              size: "sm"
            }),
            "w-fit transition-all hover:translate-y-[-2px] hover:shadow-md group"
          )}
        >
          {data?.buttons?.detail}
          <ArrowUpRight className="h-4 w-4 ml-1 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
        </LocaleLink>
      </div>

      <Carousel
        plugins={[plugin.current]}
        className="bg-transparent border-0"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {p.pics.map((item, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <Image
                    width={800}
                    height={500}
                    className='w-[100%] h-[280px] lg:h-[350px] object-contain object-center'
                    src={item}
                    alt=""
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      
      <div>
        {p.task}
      </div>
      <div className="font-bold pt-8">{data?.subTitle1}</div>
      <div className="flex gap-10 py-4 pb-8 flex-wrap">
        {p.skill.map((item, index) => {
          return <div key={index}>
            {item.icon ? <Image
              width={28}
              height={28}
              className='md:w-8 h-8 mx-auto w-full'
              src={item.icon}
              alt={item.name} /> : null}
            <p>{item.name}</p>
          </div>
        })}
      </div>

    </div>
  )
}