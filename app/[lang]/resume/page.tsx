import { Metadata } from "next";
import Resume from "./resume";
import { getDictionary } from "@/dictionaries";

export const metadata: Metadata = {
  title: "download resume page",
  description: 'This is a portfolio page about Eric Zhou, contain experience blog project etc.'
};

export default async function ResumePage({
  params
}: {
  params: Promise<{ lang: string; slug?: string[] }>
}) {
  const { lang } = await params as { lang: 'en' | 'zh' };
  const dict = await getDictionary(lang as 'en' | 'zh');
  const content = dict.home
    
  return (
    <div className='min-h-screen'>
      <Resume content={content}/>
    </div>
  );
}