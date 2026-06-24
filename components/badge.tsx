"use client";

import { useEffect } from 'react'
import { useAnimation, motion as m} from "framer-motion"
import { useInView } from 'react-intersection-observer'
import Image from "next/image";

export default function Badges({ list, block, fullContainer, color } : { 
  list: any[]; 
  block?: string;
  fullContainer?: boolean;
  color?: boolean;
}) {
	const controls = useAnimation();
	const { ref, inView  } = useInView({
		"threshold": 0.2,
		"triggerOnce": true
	})

	useEffect( () => {
		if ( inView ) {	controls.start("visible") }
	}, [ controls, inView ] );

	const container = {
		hidden: { 
			opacity: 0,
			transition: {
				delayChildren: 0.25,
				staggerChildren: 0.005
			}
		},
		visible: {
			opacity: 1,
			transition: {
				delayChildren: 0.05,
				staggerChildren: 0.01
			}
		}
	}
	
	const item = {
		hidden: {
			x: 10,
			opacity: 0.5 
		},
		visible: {
			x: 0,
			opacity: 1
		}
	}

	return (
		<m.ul
			className="relative flex flex-wrap gap-2"
			ref={ref}
			variants={container}
			initial="hidden"
			animate={controls}
			whileHover="hover"
		>

		{
			list.map( ({ name, icon } : {  name: string; icon: string }) => {
				return (
					<m.li 
						key={name}
						className="bg-gray-50/[0.8] dark:bg-white/[0.02] relative flex items-center rounded-full border border-gray-200 dark:border-white/[0.1] hover:border-gray-300 dark:hover:border-white/[0.2] px-5 py-0.5 hover:cursor-default"
						variants={item} >
						<Image
							width={28}
							height={28}
							className='w-7 h-7 md:w-8 md:h-8 mx-auto mr-2 no-select'
							src={icon}
							alt={name}
						/>
						<span className="grow text-center">{name}</span>
					</m.li> 
				)
			}) 
		}
		</m.ul>
	)
}
		
		