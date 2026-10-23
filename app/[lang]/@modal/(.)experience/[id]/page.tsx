"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation";
import Image from 'next/image';
import LocaleLink from '@/components/LocaleLink';

import experienceList from '@/content/experience.json'
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

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

export default function ProjectDetailPage () {
  const params = useParams();
  const idNum = Number(params.id);
  const p = isNaN(idNum) ? null : experienceList.find(item => item.id === idNum) ?? null;
  const [data, setData] = useState<any>(null);

  if (!p) {
    return null;
  }

  useEffect(() => {
    async function fetchData() {
      const lang = params.lang as 'en' | 'zh';
      const dict = await getDictionary(lang);
      const content = dict.experienceDetail;
      setData(content);
    }

    fetchData();
  }, [params.lang])

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  const router = useRouter();
  
  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black/[0.8] z-40" onClick={router.back}>
      <div className="2xl:w-2/5 w-11/12 lg:w-2/3 px-14 pt-7 text-black bg-white border-2 border-gray-50 rounded-2xl" onClick={ e=> e.stopPropagation()}>
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
                      className='w-[100%] h-[180px] lg:h-[48vh] object-contain object-center'
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
        <div className="font-bold pt-8"> {data?.subTitle}</div>
        <div className="flex gap-10 py-4 pb-8 flex-wrap">
          {p.skill.map((item, index) => {
            return <div key={index}>
              { item.icon ? <Image
                width={28}
                height={28}
                className='md:w-8 h-8 mx-auto w-full object-contain'
                src={item.icon}
                alt={item.name} /> : null}
              <p>{item.name}</p>
            </div>
          })}
        </div>
        <div className="pb-8 pr-2">
          <LocaleLink href={`/project#${p.link}`} target="_self"
              className={cn(
                buttonVariants({ 
                  variant: "default", 
                  size: "sm" 
                }),
                "w-fit transition-all hover:translate-y-[-2px] hover:shadow-md group"
              )}
            >
               {data?.buttons?.detail}
            <ArrowUpRight className="h-4 w-4 ml-1 hidden group-hover:block -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
          </LocaleLink>
        </div>
      </div>
    </div>
  )
}