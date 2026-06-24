# 代码审查建议

## 🔴 需要立即修复的问题

### 1. 删除废弃文件
```bash
# 删除以下文件
rm app/layout1.tsx
rm app/not-foundasdfdsf.tsx
rm app/not-foundsdfsd.tsx
rm app/pageapp.tsx
rm middleware1.ts
rm "app/[lang]/blog/page copy.tsx"
rm "app/[lang]/blog/page copy 2.tsx"
rm "app/[lang]/blog/[id]/page copy.tsx"
rm "app/[lang]/blog/client-search copy.tsx"
```

### 2. 修复 HTML lang 属性
**文件**: `app/[lang]/layout.tsx` (第 47 行)
```tsx
// 修改前
<html lang="en">

// 修改后
<html lang={lang}>
```

### 3. 移除调试代码
**文件**: `app/[lang]/blog/client-search.tsx` (第 106 行)
```tsx
// 删除这行
console.log('dddddddddddddddddddddd')
```

**文件**: `components/animation/HackerBtn.tsx` (第 28 行)
```tsx
// 删除或改为开发环境专用
setTimeout(() => console.log("Submitted"), label.length * 50);
```

### 4. 修复导入路径中的双斜杠
**文件**: `app/[lang]/page.tsx`
```tsx
// 修改前
import RecentProject from '@/components/hello//recentProject';

// 修改后
import RecentProject from '@/components/hello/recentProject';
```

### 5. 启用 TypeScript 类型检查
**文件**: `next.config.ts`
```typescript
// 修改前
typescript: {
  ignoreBuildErrors: true,
}

// 修改后
typescript: {
  ignoreBuildErrors: false, // 或直接删除此配置
}
```

## ⚠️ 重要优化

### 6. 添加 TypeScript 类型定义

创建 `types/index.ts`:
```typescript
export interface Dictionary {
  navLink: Array<{
    path: string;
    title: string;
  }>;
  blog: {
    subTitle: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export type Locale = 'en' | 'zh';

export interface PageProps {
  params: Promise<{ lang: Locale }>;
}
```

更新组件使用类型：
```tsx
// app/[lang]/page.tsx
import { PageProps } from '@/types';

export default async function Home({ params }: PageProps) {
  // ...
}

// components/navbar/Navbar.tsx
import { Dictionary } from '@/types';

const Navbar = ({ dict }: { dict: Dictionary }) => {
  // ...
}
```

### 7. 更新 Metadata
**文件**: `app/[lang]/layout.tsx`
```tsx
export const metadata: Metadata = {
  title: "Victor Zhou - Full Stack Developer",
  description: "Personal portfolio showcasing projects, experience, and blog posts",
};
```

### 8. 添加 hreflang 标签
**文件**: `app/[lang]/layout.tsx`
```tsx
export default async function RootLayout({
  children,
  modal,
  params
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ lang: 'en' | 'zh'}>
}>) {
  const { lang } = await params
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <head>
        <link rel="alternate" hreflang="en" href="/en" />
        <link rel="alternate" hreflang="zh" href="/zh" />
        <link rel="alternate" hreflang="x-default" href="/en" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ... */}
      </body>
    </html>
  );
}
```

### 9. 改进错误处理
创建统一的错误处理工具：
```typescript
// lib/error-handler.ts
export function logError(error: unknown, context: string) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  }
  // 生产环境可以发送到错误追踪服务
}
```

### 10. 环境变量验证
创建 `lib/env.ts`:
```typescript
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  supabaseUrl: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseKey: getEnvVar('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY'),
} as const;
```

## 💡 性能优化建议

### 11. 启用图片优化
**文件**: `next.config.ts`
```typescript
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fpmnzbezrrpscdrjhljy.supabase.co',
      },
    ],
  },
  output: 'standalone',
  // 移除 allowedDevOrigins 如果不需要
  // allowedDevOrigins: ['192.168.0.*'],
};
```

### 12. 添加 loading 状态
为异步组件添加 Suspense 边界和 loading UI

### 13. 代码分割
考虑使用动态导入减少初始包大小：
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

## 🔒 安全建议

### 14. 创建 .env.example
```bash
# .env.example
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_anon_key_here
```

### 15. 添加安全头
**文件**: `next.config.ts`
```typescript
const nextConfig: NextConfig = {
  // ... 其他配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

## 📝 代码风格建议

### 16. 统一组件导出方式
建议使用命名导出或默认导出，保持一致性

### 17. 添加 ESLint 规则
考虑添加更严格的 ESLint 配置来捕获潜在问题

### 18. 添加 Prettier
统一代码格式化风格

## 优先级总结

**立即修复** (P0):
- 删除废弃文件
- 修复 HTML lang 属性
- 移除调试 console.log
- 检查 .env 是否已提交到 Git

**尽快完成** (P1):
- 添加 TypeScript 类型
- 启用类型检查
- 更新 metadata
- 环境变量验证

**建议优化** (P2):
- 性能优化
- 安全头配置
- 代码风格统一
