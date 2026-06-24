"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

const Language = () => {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useLang();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const list = [
    { key: 'zh', text: '简体中文' },
    { key: 'en', text: 'English' },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        <div className="flex items-center text-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 px-2 h-10 rounded-md">
          <Globe size={22} className="mr-1" />
          {lang.toUpperCase()}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {list.map((i) => (
          <DropdownMenuCheckboxItem
            key={i.key}
            checked={lang === i.key}
            onClick={() => setLang(i.key)}
          >
            {i.text}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Language;
