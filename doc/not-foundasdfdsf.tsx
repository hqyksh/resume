import Image from "next/image"
import LocaleLink from '@/components/LocaleLink';
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer";
import { getDictionary } from "@/dictionaries";
import "./globals.css";

export default async function NotFound({
  params
}: Readonly<{
  params: Promise<{ lang: 'en' | 'zh'}>
}>) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    
    return (
        <>
            <Navbar lang={lang} dict={dict} />
            <div className="h-screen w-screen flex items-center text-gray-800 dark:text-white">
                <div className="container flex flex-col md:flex-row items-center justify-center px-5 mx-auto text-white-700">
                    <div className="max-w-md -mt-28">
                        <div className="text-5xl font-dark font-bold">404</div>
                        <p className="text-2xl md:text-3xl font-light leading-normal">Sorry we couldnt find this page. </p>
                        <p className="mb-8">But dont worry, you can find plenty of other things on our homepage.</p>

                        <LocaleLink href="/" className="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 active:bg-blue-600 hover:bg-blue-700">Home Page</LocaleLink>
                    </div>
                    <div className="max-w-lg ml-20">
                        <Image width={516} height={200} alt="" src="/empty.svg" className="opacity-65" />
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}


