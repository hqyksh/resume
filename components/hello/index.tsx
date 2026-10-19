'use client';

import React, { useState, useEffect } from 'react'
import { TypeAnimation } from 'react-type-animation';
import Image from 'next/image';
import { ArrowDownToLine  } from "lucide-react";
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

import { Dictionary } from '@/types';

export default function Hello({dict}: {dict: Dictionary}) {
	const { resolvedTheme } = useTheme();
	const [isDarkMode, setIsDarkMode] = useState(0);
	const [, setTypingStatus] = useState('Initializing');
	const content = dict.home;
	const imgs = ["/bg2.jpg", "/bg3.jpg"]
	const projectImgs = [1, 2, 3, 4];
	const [bgIndex, setBgIndex] = useState(0);
	const [imgIndex, setImgIndex] = useState(0);
	// 背景是否已完成随机选择：挂载前保持透明，挂载后淡入，避免 SSR 固定首图造成的水合不一致与闪烁
	const [bgReady, setBgReady] = useState(false);

	useEffect(() => {
		const isDarkMode = resolvedTheme === 'dark';
		isDarkMode? setIsDarkMode(1): setIsDarkMode(0)
	}, [resolvedTheme]);

	useEffect(() => {
		setBgIndex(Math.floor(Math.random() * imgs.length));
		setBgReady(true);
	}, []);

	useEffect(() => {
		const timer = setInterval(() => setImgIndex((prev) => (prev + 1) % projectImgs.length), 4000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div className='relative text-white min-h-3/4 bg-white dark:bg-transparent'>
			<div className='relative z-10 mx-auto lg:w-4/5 max-w-625 sm:px-16 px-5 lg:px-0 flex flex-col xl:flex-row items-center gap-8'>
				<div className='flex-2 xl:pb-16 pb-2'>
					<div className="h-[100]">
					<TypeAnimation key={isDarkMode} className={isDarkMode ? "text-white text-xl my-2 w-full pt-10" : "text-gray-800 lg:text-xl text-md my-2 w-full pt-10 min-h-17"}
						sequence={[
							content.intro.startDelay,
							() => { setTypingStatus('typing') },
							content.intro.start,
							() => { setTypingStatus('typed') },
							content.intro.deleteDelay,
							() => { setTypingStatus('deleting') },
							content.intro.end,
							() => { setTypingStatus('deleted') },
							content.intro.restartDelay,
						]}
						speed={content.intro.speed}
						deletionSpeed={content.intro.deletionSpeed}
						wrapper={content.intro.wrapper}
						repeat={Infinity}
					/>
					</div>

					<section className='text-gray-800 dark:text-white'>
						<h1 className="lg:text-5xl text-4xl mt-6 logo-name font-light">
							{content.header.name}
						</h1>
						<h1 className="lg:text-4xl text-xl my-5 font-thin">
							{content.header.usp}
						</h1>
						<p className="lg:text-xl text-md leading-8">
							{content.paragraph}
						</p>
					</section>

					<section className='mt-10 flex flex-col justify-between gap-5 sm:flex-row sm:justify-start'>
						<a href="mailto:alexy55@163.com" target="_blank" className="flex flex-1 sm:flex-none justify-center bg-blue-800 text-white items-center rounded-4xl py-3 px-15 font-bold hover:bg-blue-700 cursor-pointer active:ring-blue-600 active:ring-2 hover:-translate-y-1 transition-all duration-150 ease-in-out hover:shadow-md">
							{content.buttons.primary}
						</a>
						
						<a
							href="/icons/Ericzhou-fullstack-developer.pdf"
							target="_blank"
							download
							className="flex flex-1 sm:flex-none items-center justify-center bg-white text-gray-800 border dark:border-gray-800 border-gray-400 rounded-4xl py-3 px-12 font-bold hover:bg-gray-50 cursor-pointer active:ring-blue-600 active:ring-2  hover:-translate-y-1 transition-all duration-150 ease-in-out hover:shadow-md"
						>
							<ArrowDownToLine />{content.buttons.secondary}
						</a>
					</section>
				</div>
				<div className="flex-3 w-full flex flex-col items-center justify-center">
					<div className="group relative w-full aspect-[16/7] xl:aspect-[16/10] overflow-hidden mt-6 mb-3">
						<AnimatePresence initial={false}>
							<motion.div
								key={imgIndex}
								initial={{ opacity: 0, scale: 1.05 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.6, ease: 'easeInOut' }}
								className="absolute xl:inset-0"
							>
								<motion.div
									whileHover={{ scale: 0.95 }}
									transition={{ duration: 0.4, ease: 'easeInOut' }}
									className="w-full h-full"
								>
									<Image
										width={1920}
										height={868}
										alt="project screenshot"
										src={`/project/${projectImgs[imgIndex]}.jpg`}
										className="w-full h-full object-contain xl:object-cover transition-all duration-500 group-hover:object-contain"
										quality={80}
									/>
								</motion.div>
							</motion.div>
						</AnimatePresence>
					</div>
					<div className="flex justify-center gap-2 mt-2 mb-5">
						{projectImgs.map((n, i) => (
							<button
								key={n}
								aria-label={`project ${n}`}
								onClick={() => setImgIndex(i)}
								className={`h-2 w-8 cursor-pointer ring-1 ring-black/30 transition-all duration-300 ${i === imgIndex ? 'bg-blue-600 ring-blue-600' : 'bg-white hover:bg-gray-200'}`}
							/>
						))}
					</div>
				</div>
			</div>
			<Image src={imgs[bgIndex]} width={1280} height={850} alt='' className={`absolute w-full h-full left-0 top-0 pointer-events-none transition-opacity duration-700 ${bgReady ? 'opacity-16' : 'opacity-0'}`} loading="lazy" quality={60} />
		</div>
	)
}