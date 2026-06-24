"use client";

import { useParams, useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';

export type Lang = 'zh' | 'en';

export function useLang() {
  const router   = useRouter();
  const pathname = usePathname();        // 形如 /en/about
  const params   = useParams();          // { lang?: string }

  const lang = useMemo(() => {
    const l = Array.isArray(params.lang) ? params.lang[0] : params.lang;
    return l === 'en' ? 'en' : 'zh';
  }, [params.lang]);

  const setLang = (next: Lang) => {
    // 把当前路径第一段语言换掉
    const segs = pathname.split('/');
    segs[1] = next;               // segs[0] 永远是 ""
    router.replace(segs.join('/'), { scroll: false });
  };

  return [lang, setLang] as const;
}