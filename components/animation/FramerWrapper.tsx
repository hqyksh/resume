"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
type FramerMotionProps = {
    children: React.ReactNode,
    className?:string,
    // x/y/scale 保留以兼容历史调用，全站入场动画统一为纯渐入，不再产生位移与缩放
    y?:number
    x?:number
    delay?:number
    duration?: number
    scale?:number
}
function FramerWrapper({children, delay = 0.15, duration = 0.4, className}:FramerMotionProps) {
  return (
    <AnimatePresence>
      <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{delay: delay, duration: duration, ease: 'easeOut'}}
      className={`${className} text-black dark:text-white`}
      >{children}</motion.div>
    </AnimatePresence>
  );
}

export default FramerWrapper;
