"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export const PinContainer = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateY(-20deg) scale(1)"
  );

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateY(0deg) scale(1.04)");
  };
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateY(-20deg) scale(1)");
  };

  return (
    <div
      className={cn(
        "relative group/pin z-50 cursor-pointer w-full h-full",
        containerClassName
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute w-full h-full left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{
            transformOrigin: 'right center',
            transform: transform,
          }}
          className="absolute z-1000 left-1/2 p-4 top-1/2 w-full h-125 flex justify-start items-start rounded-2xl  shadow-[0_8px_16px_rgb(0_0_0/0.4)] border border-white/10 group-hover/pin:border-white/20 transition duration-700 overflow-hidden bg-white/10 dark:bg-black/10 hover:bg-white/70 dark:hover:bg-black/70 " 
        >
          <div className={cn(" relative z-50 w-full h-full ", className)}>{children}</div>
        </div>
      </div>
    </div>
  );
};
