'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  target?: string;
};

export default function LocaleLink({ href, children, ...props }: Props) {
  const params = useParams();
  const locale = params?.lang as string | undefined;

  // 如果已经是带 locale 的路径，或 href 是外部链接，跳过处理
  const isExternal = href.startsWith('http') || href.startsWith('mailto');
  const hasLocalePrefix = locale && href.startsWith(`/${locale}`);

  const finalHref =
    isExternal || hasLocalePrefix
      ? href
      : `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
  return (
    <Link href={finalHref} {...props}>
      {children}
    </Link>
  );
}