import { Dictionary } from '@/types';

export default function Footer({dict}: {dict: Dictionary}) {
	return (
		<footer className="footer sm:footer-horizontal footer-center text-black dark:text-gray-200 p-4">
			<aside>
				<p>Copyright © {new Date().getFullYear()} - {dict.footer.copyright}</p>
			</aside>
		</footer>
	);
}
