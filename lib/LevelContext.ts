'use client'; 

import { createContext } from 'react';

type LangInfo = {
  lang: string;           // 语言代号
  dict: Record<string, string>; // 字典
};

export const LangCtx = createContext<LangInfo>({
  lang: 'en',             // 默认值，避免 undefined
  dict: {},
});

