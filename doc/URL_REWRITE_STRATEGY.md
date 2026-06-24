# URL 重写策略说明

## 需求

用户希望访问 `http://localhost:3000/` 时：
- ✅ 显示英文内容（默认语言）
- ✅ URL 保持为 `/`，不显示 `/en`
- ✅ 访问 `/zh` 时显示中文内容

## 解决方案：使用 NextResponse.rewrite()

### 重定向 vs 重写

#### 1. 重定向（Redirect）- 之前的方式
```typescript
// 用户访问: http://localhost:3000/
// 浏览器地址栏变为: http://localhost:3000/en
return NextResponse.redirect(new URL('/en', request.url));
```

**特点**:
- ❌ URL 会改变（显示 `/en`）
- ✅ 浏览器会发起新请求
- ✅ SEO 友好（搜索引擎能识别）

#### 2. 重写（Rewrite）- 当前方式
```typescript
// 用户访问: http://localhost:3000/
// 浏览器地址栏保持: http://localhost:3000/
// 但实际渲染: /en 的内容
return NextResponse.rewrite(new URL('/en', request.url));
```

**特点**:
- ✅ URL 不变（保持 `/`）
- ✅ 服务器内部处理
- ✅ 用户体验更好
- ⚠️ 需要注意 SEO 配置

## 当前实现

### middleware.ts

```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 静态资源 & API 直接放过
  if (/^\/(_next|api|favicon|images)/.test(pathname)) {
    return NextResponse.next();
  }

  // 2. 如果 URL 已经带 /en 或 /zh 就放过
  const localeInPath = locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (localeInPath) {
    return NextResponse.next();
  }

  // 3. 根路径 / 重写到 /en（URL 不变）
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/en';
    return NextResponse.rewrite(url);
  }

  // 4. 其他路径重写到对应语言路径
  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.rewrite(url);
}
```

## URL 行为对照表

| 用户访问 | 浏览器显示 | 实际渲染 | 说明 |
|---------|-----------|---------|------|
| `/` | `/` | `/en` 内容 | 默认英文，URL 不变 |
| `/en` | `/en` | `/en` 内容 | 显式英文 |
| `/zh` | `/zh` | `/zh` 内容 | 显式中文 |
| `/about` | `/about` | `/en/about` 内容 | 根据浏览器语言 |
| `/blog` | `/blog` | `/en/blog` 或 `/zh/blog` | 根据浏览器语言 |

## 优势

### 1. 更简洁的 URL
```
✅ http://your-domain.com/
❌ http://your-domain.com/en
```

### 2. 更好的用户体验
- 用户不需要看到语言代码
- URL 更短更易记
- 分享链接更友好

### 3. 灵活的语言切换
- 用户可以通过语言切换器改变语言
- 访问 `/zh` 可以切换到中文
- 访问 `/en` 可以切换到英文

## SEO 考虑

### 1. 添加 hreflang 标签

在 `app/[lang]/layout.tsx` 中添加：

```tsx
export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  
  return (
    <html lang={lang}>
      <head>
        {/* 告诉搜索引擎不同语言版本的 URL */}
        <link rel="alternate" hreflang="en" href="https://your-domain.com/en" />
        <link rel="alternate" hreflang="zh" href="https://your-domain.com/zh" />
        <link rel="alternate" hreflang="x-default" href="https://your-domain.com/" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. 添加 Canonical URL

```tsx
export async function generateMetadata({ params }) {
  const { lang } = await params;
  
  return {
    alternates: {
      canonical: `https://your-domain.com/${lang}`,
      languages: {
        'en': 'https://your-domain.com/en',
        'zh': 'https://your-domain.com/zh',
      },
    },
  };
}
```

### 3. Sitemap 配置

创建 `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://your-domain.com';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          zh: `${baseUrl}/zh`,
        },
      },
    },
    // 其他页面...
  ];
}
```

## 语言切换实现

### 方案一：使用链接切换

```tsx
// components/LanguageSwitcher.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  
  // 移除当前语言前缀
  const pathWithoutLang = pathname.replace(/^\/(en|zh)/, '') || '/';
  
  return (
    <div>
      <Link href={`/en${pathWithoutLang}`}>English</Link>
      <Link href={`/zh${pathWithoutLang}`}>中文</Link>
    </div>
  );
}
```

### 方案二：使用 Cookie 记住语言偏好

```typescript
// middleware.ts
function getLocale(req: NextRequest) {
  // 1. 先检查 Cookie
  const cookieLang = req.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLang && locales.includes(cookieLang)) {
    return cookieLang;
  }
  
  // 2. 再检查 Accept-Language
  const h = req.headers.get('accept-language') || '';
  const langs = new Negotiator({ headers: { 'accept-language': h } }).languages();
  return match(langs, locales, defaultLocale);
}

// 设置 Cookie
export function middleware(request: NextRequest) {
  // ... 其他逻辑
  
  const response = NextResponse.rewrite(url);
  response.cookies.set('NEXT_LOCALE', locale, { maxAge: 31536000 });
  return response;
}
```

## 测试

### 1. 测试根路径

```bash
# 访问根路径
curl http://localhost:3000/

# 应该返回英文内容，URL 不变
```

### 2. 测试语言路径

```bash
# 访问英文
curl http://localhost:3000/en

# 访问中文
curl http://localhost:3000/zh
```

### 3. 测试子路径

```bash
# 访问 /about（应该显示英文内容）
curl http://localhost:3000/about

# 访问 /en/about
curl http://localhost:3000/en/about

# 访问 /zh/about
curl http://localhost:3000/zh/about
```

## 注意事项

### 1. 客户端导航

使用 `LocaleLink` 组件确保链接正确：

```tsx
// components/LocaleLink.tsx
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LocaleLink({ href, ...props }) {
  const params = useParams();
  const lang = params.lang || 'en';
  
  // 如果 href 已经包含语言，直接使用
  if (href.startsWith('/en') || href.startsWith('/zh')) {
    return <Link href={href} {...props} />;
  }
  
  // 否则添加当前语言
  const localizedHref = href === '/' ? `/${lang}` : `/${lang}${href}`;
  return <Link href={localizedHref} {...props} />;
}
```

### 2. API 路由

API 路由不受语言影响：

```typescript
// app/api/data/route.ts
export async function GET() {
  return Response.json({ data: 'hello' });
}

// 访问: /api/data（不需要语言前缀）
```

### 3. 静态资源

静态资源路径不变：

```tsx
<Image src="/images/logo.png" alt="Logo" />
// 访问: /images/logo.png（不需要语言前缀）
```

## 回滚到重定向方式

如果需要回到重定向方式（URL 显示 `/en`）：

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // ... 其他逻辑
  
  // 使用 redirect 而不是 rewrite
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}
```

## 总结

当前实现：
- ✅ 访问 `/` 显示英文内容，URL 保持 `/`
- ✅ 访问 `/en` 显示英文内容
- ✅ 访问 `/zh` 显示中文内容
- ✅ 其他路径根据浏览器语言自动处理
- ✅ URL 更简洁，用户体验更好

这种方式适合：
- 希望默认语言的 URL 更简洁
- 不想在 URL 中显示语言代码
- 需要更好的用户体验

---

更新时间: 2026年3月1日
策略: URL Rewrite（重写）而非 Redirect（重定向）
