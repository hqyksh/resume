"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export const SchoolImage = () => {
    const imgs = ["/school/scnydx2.jpg", "/school/scnydx.jpg", "/school/scnydx1.png", "/school/scnydxlogo.png"];
    const [num, setNum] = useState(0);

    useEffect(() => {
        const DURATION = 5800;
        let last = performance.now();
        let animationFrameId: number;

        function tick() {
            const now = performance.now();
            const elapsed = now - last;
            const steps = Math.floor(elapsed / DURATION);
            
            if (steps > 0) {
                setNum((prevNum) => (prevNum >= 3 ? 0 : prevNum + 1));
                last = now;
            }
            
            animationFrameId = requestAnimationFrame(tick);
        }
        
        animationFrameId = requestAnimationFrame(tick);

        // 清理函数
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return (
        <div className="relative w-full aspect-[16/7] xl:aspect-[16/10]">
            {imgs.map((src, i) => (
                <Image
                    key={src}
                    src={src}
                    alt="school view"
                    width={800}
                    height={500}
                    className={`
                        absolute inset-0 w-full h-full bg-[#fff]
                        transition-opacity duration-1000 ease-in-out
                        ${i === 3 ? "object-contain": "object-cover"}
                        ${i === num ? 'opacity-100' : 'opacity-0'}
                    `}
                    priority={i === 0}
                />
            ))}
        </div>
    );
};
