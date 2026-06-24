# .gitignore 更新总结

## 执行时间
2026年3月1日

## 问题
`.next` 文件夹被错误地提交到了 Git 仓库中。这个文件夹是 Next.js 的构建输出目录，不应该被版本控制。

## 解决方案

### 1. 更新 .gitignore
在 `.gitignore` 文件中添加了 `/.next/` 规则：

```gitignore
# next.js
/.next/
/out/
```

### 2. 从 Git 中移除 .next 文件夹
使用以下命令从 Git 索引中移除（但保留本地文件）：

```bash
git rm -r --cached .next
```

## 结果

- ✅ `.gitignore` 已更新，包含 `/.next/` 规则
- ✅ `.next` 文件夹已从 Git 索引中移除
- ✅ 本地 `.next` 文件夹保留（用于开发和构建）
- ✅ 未来的构建输出不会被提交到 Git

## Git 状态

所有 `.next` 文件夹中的文件现在显示为 "D"（删除）状态，这意味着它们将在下次提交时从仓库中移除。

## 下一步

提交这些更改：

```bash
git add .gitignore
git commit -m "chore: add .next to .gitignore and remove from git"
```

## 为什么 .next 不应该被提交？

1. **构建产物**: `.next` 是构建输出，每次构建都会重新生成
2. **体积大**: 包含大量编译后的文件，会增加仓库体积
3. **环境特定**: 不同环境的构建结果可能不同
4. **可重现**: 可以通过 `npm run build` 随时重新生成
5. **最佳实践**: Next.js 官方推荐不提交构建输出

## 其他应该忽略的 Next.js 文件

当前 `.gitignore` 已经正确配置了以下内容：

- ✅ `/.next/` - 构建输出
- ✅ `/out/` - 静态导出输出
- ✅ `*.tsbuildinfo` - TypeScript 增量构建信息
- ✅ `next-env.d.ts` - Next.js TypeScript 定义
- ✅ `.env*` - 环境变量文件
- ✅ `/node_modules` - 依赖包

## 参考

- [Next.js .gitignore 模板](https://github.com/vercel/next.js/blob/canary/.gitignore)
- [Git 文档 - gitignore](https://git-scm.com/docs/gitignore)

---

配置完成！现在 `.next` 文件夹不会再被提交到 Git 仓库了。
