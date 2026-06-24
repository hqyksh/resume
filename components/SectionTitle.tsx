

// Section scss
// import section from '../../styles/blocks/section.title.module.scss'

/**
 * Section header component
 * 
 * @param {string} * strings for header
 * @returns 
 */
export default function SectionTitle({ preTitle, title, subTitle }: {
  preTitle: string;
  title: string;
  subTitle: string;
}) {
	return (
		<>
		<div className="flex flex-col justify-center px-1 text-center mb-8 text-black dark:text-white">
			<h4>{preTitle}</h4>
			<h2 className="2xl:text-4xl text-2xl my-5">{title}</h2>
			<p className="xl:text-xl text-md">{subTitle}</p>
		</div>
		</>
	)

}