import React from 'react'
import FramerWrapper from "@/components/animation/FramerWrapper";
import project from '@/content/project.json';
import experienceList from '@/content/experience.json';
import { Metadata } from "next";
import Slide from './slide';
import LocaleLink from '@/components/LocaleLink';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { getDictionary } from '@/dictionaries';

export const metadata: Metadata = {
  title: "project page",
  description: 'This is a portfolio page about Ethen Zhou, contain experience blog project etc.'
};

// 通过 linkId 或 url(/experience/N) 在 experience.json 中查找对应公司的 logo
function getCompanyImage(item: { linkId?: string; url?: string }): string | null {
  // 1. 通过 linkId 匹配 experience.link
  if (item.linkId) {
    const exp = (experienceList as Array<{ link?: string; logo: string }>)
      .find(e => e.link === item.linkId);
    if (exp && exp.logo && !exp.logo.includes('empty')) return exp.logo;
  }
  // 2. 通过 url 中的 id 匹配 experience.id
  if (item.url) {
    const m = item.url.match(/\/experience\/(\d+)/);
    if (m) {
      const id = Number(m[1]);
      const exp = (experienceList as Array<{ id: number; logo: string }>)
        .find(e => e.id === id);
      if (exp && exp.logo && !exp.logo.includes('empty')) return exp.logo;
    }
  }
  return null;
}

const ProjectPage = async ({
  params
}: {
  params: Promise<{ lang: string; slug?: string[] }>
}) => {
  const { lang } = await params as { lang: 'en' | 'zh' };
  const dict = await getDictionary(lang as 'en' | 'zh');

  const content = dict.project;

  return (
    <div className="lg:w-2/3 px-5 lg:px-0 mx-auto mb-15 overflow-hidden">
      <div className="flex flex-col gap-3 mb-10">
        <FramerWrapper y={0} x={200} className="mt-8">
          <p className="font-poppins text-lg w-full max-sm:text-base">
            {content.subTitle}
          </p>
        </FramerWrapper>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {project.map((item, index) => {
          const hasImages = item.images && item.images.length > 0;
          // 无项目截图时，回退到对应公司的 logo 图
          const companyImage = hasImages ? null : getCompanyImage(item);
          const heroImages = hasImages ? item.images : (companyImage ? [companyImage] : []);
          return (
            <FramerWrapper
              key={index}
              y={30}
              delay={Math.min(index * 0.05, 0.4)}
              className="h-full"
            >
              <Card
                id={item.linkId}
                className="overflow-hidden h-full flex flex-col gap-0 py-0 scroll-mt-24 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* 图片展示区 - 首要展示 */}
                {heroImages.length > 0 ? (
                  <Slide images={heroImages} />
                ) : (
                  <div className="aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center p-6">
                    <div className="flex flex-wrap gap-4 justify-center max-w-md">
                      {item.stack.map((st, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 opacity-70">
                          {st.icon ? (
                            <Image
                              src={st.icon}
                              alt={st.name}
                              width={36}
                              height={36}
                              className="w-9 h-9"
                            />
                          ) : null}
                          <span className="text-xs text-muted-foreground">{st.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 内容区 */}
                <CardContent className="p-5 lg:p-6 flex flex-col gap-3 flex-1">
                  {/* 顶部：公司 + 时间 */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    {item.url ? (
                      <LocaleLink
                        href={item.url}
                        target='_blank'
                        className="text-sky-600 dark:text-sky-400 font-medium hover:underline"
                      >
                        {item.company}
                      </LocaleLink>
                    ) : (
                      <span className="text-muted-foreground font-medium">{item.company}</span>
                    )}
                    <span className="text-muted-foreground">{item.time}</span>
                  </div>

                  {/* 标题 */}
                  <h3 className="text-lg lg:text-xl font-bold leading-snug word-break wrap-break-word">
                    {item.title}
                  </h3>

                  {/* 描述 */}
                  {item.description ? (
                    <p className="text-sm text-muted-foreground leading-relaxed word-break wrap-break-word">
                      {item.description}
                    </p>
                  ) : null}

                  {/* 职责 */}
                  {item.zhize.length ? (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {content.job}
                      </div>
                      {Array.isArray(item.zhize) ? (
                        <ul className="space-y-1.5 text-sm text-muted-foreground">
                          {item.zhize.map((zz, i) => (
                            <li key={i} className="flex gap-2 leading-relaxed">
                              <span className="text-sky-500 mt-1 flex-shrink-0">•</span>
                              <span>{zz}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.zhize}</p>
                      )}
                    </div>
                  ) : null}

                  {/* 成果 - 高亮显示 */}
                  {item.result.length ? (
                    <div className="space-y-2 p-3 rounded-lg bg-sky-50 dark:bg-sky-950/30">
                      <div className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                        {content.result}
                      </div>
                      {Array.isArray(item.result) ? (
                        <ul className="space-y-1 text-sm">
                          {item.result.map((rt, i) => (
                            <li key={i} className="leading-relaxed">{rt}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm leading-relaxed">{item.result}</p>
                      )}
                    </div>
                  ) : null}

                  {/* 技术栈 - 置底 */}
                  {item.stack.length ? (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 pt-6 mt-auto border-t">
                      {item.stack.map((st, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          {st.icon ? (
                            <Image
                              src={st.icon}
                              alt={st.name}
                              width={16}
                              height={16}
                              className="w-4 h-4"
                            />
                          ) : null}
                          <span className="text-xs text-muted-foreground">{st.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </FramerWrapper>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectPage;
