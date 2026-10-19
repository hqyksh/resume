"use client"

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type ImgSize = { width: number; height: number } | null;

function ImageModal({
  show,
  onClose,
  img,
  imgSize
}: {
  show: boolean;
  onClose: () => void;
  img: string | null;
  imgSize: ImgSize;
}) {
  // 仅在客户端且确实需要展示时才挂载到 body，避免 SSR 报错
  if (!show || !img || !imgSize || typeof document === 'undefined') return null;

  // 通过 Portal 把 Modal 渲染到 body，脱离 Card 的 DOM 层级
  // 否则 Card 的 hover:transform 会作为 modal position:fixed 的 containing block，导致 modal 尺寸/位置抖动
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-screen max-h-screen flex items-center justify-center cursor-zoom-out"
      >
        <Image
          src={img}
          alt="preview"
          width={imgSize.width}
          height={imgSize.height}
          style={{
            maxWidth: '100vw',
            maxHeight: '100vh',
            display: 'block',
            margin: '0 auto',
          }}
          className="object-contain rounded shadow-lg"
          priority
        />
      </div>
    </div>,
    document.body
  );
}

export default function Slide({images} : {images: string[]}) {
  const [showModal, setShowModal] = useState(false);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState<ImgSize>(null);

  const handleImgClick = (img: string) => {
    // 动态获取图片原始宽高，浏览器会缓存该图，避免 modal 闪烁
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
      <Carousel className="bg-transparent border-0 w-full">
        <CarouselContent>
          {images.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full aspect-[16/10] bg-muted/30 dark:bg-black/20 overflow-hidden">
                <Image
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain object-center cursor-zoom-in"
                  src={item}
                  alt={`project-image-${index}`}
                  onClick={() => handleImgClick(item)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className='hidden xl:block'>
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>

      <ImageModal show={showModal} onClose={handleClose} img={currentImg} imgSize={imgSize} />
    </>
  );
}
