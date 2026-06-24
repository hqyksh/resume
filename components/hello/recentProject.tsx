import FeaturedProject from "../featured";
import SectionTitle from "../SectionTitle";
import content from "@/content/featured.json";

import { Dictionary } from '@/types';

export default function FeaturedProjects({dict}: {dict: Dictionary}) {
  const contentLang = dict.home;
  
  return (
    <div className="text-white lg:w-4/5 max-w-[2500px] sm:px-16 px-5 lg:px-0 mx-auto overflow-hidden mt-8 mb-8">
      <SectionTitle
        title={contentLang.title}
        preTitle={contentLang.preTitle}
        subTitle={contentLang.subTitle}
      />

      {content.map((data, index) => {
        return <FeaturedProject content={data} contentLang={contentLang} index={index} key={index} />;
      })}
    </div>
  );
}
