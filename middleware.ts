import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'zh'];
const defaultLocale = 'en';

function getLocale(req: NextRequest) {
  const h = req.headers.get('accept-language') || '';
  const langs = new Negotiator({ headers: { 'accept-language': h } }).languages();
  return match(langs, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. 静态资源 & API 直接放过
  if (/^\/(_next|api|favicon|images)/.test(pathname)) return NextResponse.next();

  // 2. 如果 URL 已经带 /en 或 /zh 就放过
  const localeInPath = locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (localeInPath) return NextResponse.next();

  // 3. 根路径 / 直接重写到 /en（不重定向，URL 不变）
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/en';
    return NextResponse.rewrite(url);
  }

  // 4. 其他路径（如 /about）重写到 /en/about
  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // 只拦截 HTML 请求，把真正静态文件放掉
  // matcher: ['/((?!_next/static|_next/image|favicon.ico|api|icons|/$).*)'],
  matcher: ['/((?!_next/static|_next/image|api|favicon.ico|icons/|project/|school/|.*\\..*$).*)',],
};