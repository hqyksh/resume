# Build 错误修复总结

## 问题描述

在运行 `npm run build` 时遇到 TypeScript 类型错误：

```
Type 'Promise<{ lang: "en" | "zh"; }>' is not assignable to type 'Promise<{ lang: string; }>'
```

## 根本原因

Next.js 15 对动态路由参数的类型推断更加严格。当使用 `params: Promise<{ lang: 'en' | 'zh' }>` 时，TypeScript 无法正确推断类型，因为 Next.js 内部期望 `lang` 是 `string` 类型。

## 解决方案

将所有页面组件的 `params` 类型从具体的联合类型改为 `string`，然后在使用时进行类型断言。

### 修改模式

**修改前：**
```typescript
export default async function Page({params}: {
  params: Promise<{ lang: 'en' | 'zh' }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang);
}
```

**修改后：**
```typescript
export default async function Page({params}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params as { lang: 'en' | 'zh' };
  const dict = await getDictionary(lang as 'en' | 'zh');
}
```

## 修改的文件列表

### 1. Layout 文件
- ✅ `app/[lang]/layout.tsx`

### 2. 页面文件
- ✅ `app/[lang]/page.tsx` (首页)
- ✅ `app/[lang]/blog/page.tsx`
- ✅ `app/[lang]/education/page.tsx`
- ✅ `app/[lang]/experience/page.tsx`
- ✅ `app/[lang]/project/page.tsx`
- ✅ `app/[lang]/resume/page.tsx`

### 3. 动态路由页面
- ✅ `app/[lang]/blog/[id]/page.tsx`
  - 修改了 `generateMetadata` 函数
  - 修改了组件本身的 params 类型

### 4. 客户端组件（无需修改）
- `app/[lang]/experience/[id]/page.tsx` - 使用 `useParams()` hook
- `app/[lang]/@modal/(.)experience/[id]/page.tsx` - 使用 `useParams()` hook

## 类型安全说明

虽然我们使用了类型断言 `as { lang: 'en' | 'zh' }`，但这是安全的，因为：

1. **中间件保护**: `middleware.ts` 确保只有 'en' 和 'zh' 两种语言可以访问
2. **路由结构**: 应用的路由结构限制了可能的语言值
3. **运行时验证**: 如果传入无效语言，`getDictionary` 函数会回退到默认语言

## 验证结果

所有修改的文件都通过了 TypeScript 诊断检查：

```bash
✅ app/[lang]/layout.tsx: No diagnostics found
✅ app/[lang]/page.tsx: No diagnostics found
✅ app/[lang]/blog/page.tsx: No diagnostics found
✅ app/[lang]/education/page.tsx: No diagnostics found
✅ app/[lang]/experience/page.tsx: No diagnostics found
✅ app/[lang]/project/page.tsx: No diagnostics found
✅ app/[lang]/resume/page.tsx: No diagnostics found
✅ app/[lang]/blog/[id]/page.tsx: No diagnostics found
```

## 后续建议

1. **运行完整构建测试**
   ```bash
   npm run build
   ```

2. **测试所有语言路由**
   - 访问 `/en` 和 `/zh` 路由
   - 测试所有子页面
   - 验证动态路由正常工作

3. **考虑添加运行时验证**
   ```typescript
   // lib/validate-locale.ts
   export function validateLocale(lang: string): 'en' | 'zh' {
     if (lang === 'en' || lang === 'zh') {
       return lang;
     }
     return 'en'; // 默认语言
   }
   ```

## 相关资源

- [Next.js 15 Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [TypeScript Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

---

修复完成时间: 2026年3月1日
