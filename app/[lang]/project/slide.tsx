"use client"

import React, { useState } from 'react'
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


export default function Slide({images} : {images: string[]}) {
  const [showModal, setShowModal] = useState(false);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null);

  // 动态导入 Modal 组件，ssr: false
  const Modal = dynamic(() => Promise.resolve(({ show, onClose, img, imgSize }: { show: boolean, onClose: () => void, img: string | null, imgSize: { width: number; height: number } | null }) => {
    if (!show) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative max-w-3xl w-[100vw] max-h-[100vh] flex items-center justify-center"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-white bg-black/60 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80"
            onClick={onClose}
            aria-label="关闭"
          >
            ×
          </button>
          {img && imgSize && (
            <Image
              src={img}
              alt="preview"
              width={imgSize.width}
              height={imgSize.height}
              style={{
                maxWidth: '100vw',
                maxHeight: '100vh',
                width: 'auto',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
              }}
              className="object-contain rounded shadow-lg"
              priority
            />
          )}
        </div>
      </div>
    );
  }), { ssr: false });

  const handleImgClick = (img: string) => {
    // 动态获取图片原始宽高
    const image = new window.Image();
    image.src = img;
    image.onload = () => {
      setImgSize({ width: image.naturalWidth, height: image.naturalHeight });
      setCurrentImg(img);
      setShowModal(true);
    };
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentImg(null);
    setImgSize(null);
  };

  return (
    <>
      <Carousel className="bg-transparent border-0">
        <CarouselContent>
          {images.map((item, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <Image
                    width={800}
                    height={500}
                    className='w-[100%] h-[280px] lg:h-[350px] object-contain object-center cursor-zoom-in'
                    src={item}
                    alt=""
                    onClick={() => handleImgClick(item)}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Modal for image preview，仅在客户端渲染，避免 hydration 报错 */}
      <Modal show={showModal} onClose={handleClose} img={currentImg} imgSize={imgSize} />
    </>
  );
}

