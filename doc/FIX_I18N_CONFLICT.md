# 修复 i18n 配置冲突导致的 404 错误

## 问题
访问 `http://localhost:3000/zh` 或 `http://localhost:3000/en` 时显示 404 错误。

## 根本原因
`next.config.ts` 中配置了 Pages Router 的 `i18n` 选项：

```typescript
i18n: {
  locales: ['en', 'zh'],
  defaultLocale: 'en',
}
```

这与 App Router 的动态路由 `app/[lang]` 产生了冲突。

## 为什么会冲突？

### Pages Router 的 i18n（旧方式）
- 使用 `next.config.ts` 中的 `i18n` 配置
- Next.js 自动处理路由：`/en/page` 和 `/zh/page`
- 适用于 `pages/` 目录

### App Router 的 i18n（新方式）
- 使用动态路由段：`app/[lang]/page.tsx`
- 通过中间件手动处理语言重定向
- 适用于 `app/` 目录

**两者不能同时使用！**

## 解决方案

从 `next.config.ts` 中移除 `i18n` 配置：

```typescript
// ❌ 错误 - 不要在 App Router 中使用
const nextConfig: NextConfig = {
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
  },
  // ...
};

// ✅ 正确 - App Router 使用动态路由
const nextConfig: NextConfig = {
  // 移除 i18n 配置
  // 使用 app/[lang] 动态路由 + middleware.ts
  // ...
};
```

## 已修复

✅ 从 `next.config.ts` 中移除了 `i18n` 配置

## 下一步

1. **重启开发服务器**
   ```bash
   # 停止当前服务器 (Ctrl+C)
   npm run dev
   ```

2. **验证修复**
   - 访问 http://localhost:3000 → 应该重定向到 `/en` 或 `/zh`
   - 访问 http://localhost:3000/en → 显示英文首页
   - 访问 http://localhost:3000/zh → 显示中文首页

## 当前的国际化实现

项目使用 App Router 的国际化方案：

1. **动态路由**: `app/[lang]/page.tsx`
2. **中间件**: `middleware.ts` 处理语言检测和重定向
3. **字典**: `dictionaries/` 目录存储翻译
4. **类型安全**: TypeScript 类型定义确保语言参数正确

## 参考

- [Next.js App Router 国际化](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Next.js i18n 配置（仅用于 Pages Router）](https://nextjs.org/docs/pages/building-your-application/routing/internationalization)

---

修复时间: 2026年3月1日
问题: App Router 与 Pages Router i18n 配置冲突
解决: 移除 next.config.ts 中的 i18n 配置
