import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse } from "next/server";

const locales = ["en", "zh"];
const defaultLocale = "en";

function getLocale(request) {
  const headers = request.headers.get("accept-language");
  const languages = new Negotiator({ headers }).languages();

  // 清理 languages 数组，提取有效的语言环境标识符，并过滤无效值
  const cleanedLanguages = languages
    .map((lang) => {
      // 去掉权重信息（如 q=0.9）
      return lang.split(";")[0];
    })
    .filter((lang) => {
      // 过滤无效的语言环境标识符（如 '*'）
      return lang !== "*" && lang.trim() !== "";
    });


  // 如果清理后的数组为空，返回默认语言环境
  if (cleanedLanguages.length === 0) {
    return defaultLocale;
  }

  return match(cleanedLanguages, locales, defaultLocale);
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (/\.([a-z0-9]+)$/i.test(pathname)) return;
  if (/^\/(zh|en)(\/|$)/.test(pathname)) return;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next).*)",
  ],
};