# 修复 404 错误

## 问题
本地开发服务器启动后访问任何页面都显示 404 错误。

## 原因
`.next` 文件夹被标记为从 Git 删除后，可能导致开发服务器使用了不一致的缓存状态。

## 解决方案

### 1. 停止开发服务器
在运行 `npm run dev` 的终端中按 `Ctrl+C` 停止服务器。

### 2. 清理 .next 文件夹
```bash
# 已执行：删除 .next 文件夹
rm -rf .next
```

### 3. 重新启动开发服务器
```bash
npm run dev
```

### 4. 访问网站
打开浏览器访问：
- http://localhost:3000 （会自动重定向到 /en 或 /zh）
- http://localhost:3000/en （英文版）
- http://localhost:3000/zh （中文版）

## 验证

访问以下页面确认一切正常：
- ✅ http://localhost:3000/en - 首页
- ✅ http://localhost:3000/en/blog - 博客
- ✅ http://localhost:3000/en/education - 教育
- ✅ http://localhost:3000/en/experience - 经验
- ✅ http://localhost:3000/en/project - 项目
- ✅ http://localhost:3000/en/resume - 简历

## 为什么会出现这个问题？

1. `.next` 文件夹被 `git rm --cached` 标记为删除
2. 开发服务器可能读取了 Git 状态，导致混淆
3. 删除并重建 `.next` 文件夹可以解决这个问题

## 预防措施

以后如果遇到类似问题：

1. **清理缓存**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **完全重建**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run dev
   ```

3. **检查端口占用**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # 如果端口被占用，杀掉进程
   taskkill /PID <进程ID> /F
   ```

## 注意事项

- `.next` 文件夹已经添加到 `.gitignore`，不会再被提交
- 每次 `npm run dev` 或 `npm run build` 都会重新生成 `.next` 文件夹
- 这是正常的开发流程，不用担心

---

执行时间: 2026年3月1日
