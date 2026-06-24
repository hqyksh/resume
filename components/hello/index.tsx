'use client';

import React, { useState, useEffect } from 'react'
import { TypeAnimation } from 'react-type-animation';
import Image from 'next/image';
import { ArrowDownToLine  } from "lucide-react";
import { useTheme } from 'next-themes';
import { PinContainer } from "@/components/animation/Pin";
const num = Math.floor(Math.random() * 2);

import { Dictionary } from '@/types';

export default function Hello({dict}: {dict: Dictionary}) {
	const { resolvedTheme } = useTheme();
	const [isDarkMode, setIsDarkMode] = useState(0);
	const [, setTypingStatus] = useState('Initializing');
	const content = dict.home;
	const imgs = ["/bg2.jpg", "/bg3.jpg"]

	useEffect(() => {
		const isDarkMode = resolvedTheme === 'dark';
		isDarkMode? setIsDarkMode(1): setIsDarkMode(0)
	}, [resolvedTheme]);

	return (
		<div className='relative text-white min-h-3/4 bg-white dark:bg-transparent'>
			<div className='relative z-10 mx-auto lg:w-4/5 max-w-625 sm:px-16 px-5 lg:px-0 flex flex-col lg:flex-row items-center gap-8'>
				<div className='flex-2 pb-16'>
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
							href="/icons/ericzhou-fullstack-developer.pdf"
							target="_blank"
							download
							className="flex flex-1 sm:flex-none items-center justify-center bg-white text-gray-800 border-2 dark:border-gray-800 border-gray-400 rounded-4xl py-3 px-12 font-bold hover:bg-gray-50 cursor-pointer active:ring-blue-600 active:ring-2  hover:-translate-y-1 transition-all duration-150 ease-in-out hover:shadow-md"
						>
							<ArrowDownToLine />{content.buttons.secondary}
						</a>
					</section>
				</div>
				<div className="flex-3 shrink-0 hidden xl:flex items-center justify-center h-[88vh] ">
					<PinContainer>
						<figure className="hover-gallery w-full h-full">
							<Image
								width={1920}
								height={868}
								alt="school view"
								style={{ objectFit: 'fill' }} 
								src="/project/1.jpg"
								className="w-full h-full object-contain object-center"
								loading="lazy"
								quality={75}
							/>
							<Image
								width={1920}
								height={868}
								alt="school view"
								style={{ objectFit: 'fill' }} 
								src="/project/2.jpg"
								className="w-full h-full object-contain object-center"
								loading="lazy"
								quality={75}
							/>
							<Image
								width={1920}
								height={868}
								alt="school view"
								style={{ objectFit: 'fill' }} 
								src="/project/3.jpg"
								className="w-full h-full object-contain object-center"
								loading="lazy"
								quality={75}
							/>
							<Image
								width={1920}
								height={868}
								alt="school view"
								style={{ objectFit: 'fill' }} 
								src="/project/4.jpg"
								className="w-full h-full object-contain object-center"
								loading="lazy"
								quality={75}
							/>
						</figure>
					</PinContainer>
				</div>
			</div>
			<Image src={imgs[num]} width={1280} height={850} alt='' className='absolute w-full h-full left-0 top-0 opacity-16 pointer-events-none' loading="lazy" quality={60} />
		</div>
	)
}