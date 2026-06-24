# 快速测试指南

## 测试 URL 重写功能

### 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 删除缓存
rm -rf .next

# 重新启动
npm run dev
```

### 测试场景

#### 1. 访问根路径 `/`

**期望行为**:
- ✅ 浏览器地址栏显示: `http://localhost:3000/`
- ✅ 页面显示英文内容
- ✅ 没有重定向（URL 不变）

**测试命令**:
```bash
# 使用 curl 测试
curl -v http://localhost:3000/

# 应该看到:
# < HTTP/1.1 200 OK
# 不应该看到 302 或 301
```

**浏览器测试**:
1. 打开浏览器
2. 访问 `http://localhost:3000/`
3. 检查地址栏是否保持 `/`
4. 检查页面是否显示英文内容

#### 2. 访问 `/en`

**期望行为**:
- ✅ 浏览器地址栏显示: `http://localhost:3000/en`
- ✅ 页面显示英文内容

**测试命令**:
```bash
curl http://localhost:3000/en
```

#### 3. 访问 `/zh`

**期望行为**:
- ✅ 浏览器地址栏显示: `http://localhost:3000/zh`
- ✅ 页面显示中文内容

**测试命令**:
```bash
curl http://localhost:3000/zh
```

#### 4. 访问子路径 `/blog`

**期望行为**:
- ✅ 浏览器地址栏显示: `http://localhost:3000/blog`
- ✅ 页面显示英文博客内容（根据浏览器语言）
- ✅ 没有重定向

**测试命令**:
```bash
curl http://localhost:3000/blog
```

#### 5. 访问 `/en/blog`

**期望行为**:
- ✅ 浏览器地址栏显示: `http://localhost:3000/en/blog`
- ✅ 页面显示英文博客内容

**测试命令**:
```bash
curl http://localhost:3000/en/blog
```

#### 6. 访问 `/zh/blog`

**期望行为**:
- ✅ 浏览器地址栏显示: `http://localhost:3000/zh/blog`
- ✅ 页面显示中文博客内容

**测试命令**:
```bash
curl http://localhost:3000/zh/blog
```

## 对比：重定向 vs 重写

### 之前（使用 Redirect）

```bash
# 访问根路径
curl -I http://localhost:3000/

# 响应:
HTTP/1.1 302 Found
Location: http://localhost:3000/en

# 浏览器会跳转到 /en
```

### 现在（使用 Rewrite）

```bash
# 访问根路径
curl -I http://localhost:3000/

# 响应:
HTTP/1.1 200 OK

# 浏览器保持在 /，但显示 /en 的内容
```

## 浏览器开发者工具测试

### 1. 打开开发者工具

- Chrome/Edge: `F12` 或 `Ctrl+Shift+I`
- Firefox: `F12`
- Safari: `Cmd+Option+I`

### 2. 切换到 Network 标签

### 3. 访问 `http://localhost:3000/`

### 4. 检查请求

**应该看到**:
- ✅ 请求 URL: `http://localhost:3000/`
- ✅ 状态码: `200 OK`
- ✅ 没有 `302` 或 `301` 重定向

**不应该看到**:
- ❌ 重定向到 `/en`
- ❌ 两次请求（一次 `/`，一次 `/en`）

### 5. 检查响应内容

- ✅ HTML 内容应该是英文
- ✅ 页面标题应该是英文

## 语言切换测试

### 测试语言切换器

如果你有语言切换组件：

1. 访问 `http://localhost:3000/`
2. 点击"中文"切换器
3. 应该跳转到 `http://localhost:3000/zh`
4. 页面显示中文内容

### 测试浏览器语言

1. 修改浏览器语言设置为中文
2. 访问 `http://localhost:3000/about`
3. 应该显示中文内容（但 URL 保持 `/about`）

## 常见问题排查

### 问题 1: 访问 `/` 还是重定向到 `/en`

**原因**: 中间件代码未更新或缓存未清除

**解决**:
```bash
# 1. 确认 middleware.ts 使用 rewrite
cat middleware.ts | grep "rewrite"

# 2. 删除缓存
rm -rf .next

# 3. 重启服务器
npm run dev
```

### 问题 2: 页面显示 404

**原因**: 路由配置问题

**解决**:
```bash
# 检查 app/[lang] 目录结构
ls -la app/[lang]

# 应该看到 page.tsx 和 layout.tsx
```

### 问题 3: 静态资源加载失败

**原因**: 路径问题

**解决**:
- 确保静态资源路径以 `/` 开头
- 例如: `/images/logo.png` 而不是 `images/logo.png`

## 性能测试

### 测试页面加载时间

```bash
# 使用 curl 测试响应时间
time curl http://localhost:3000/

# 应该在 1 秒内完成
```

### 测试并发请求

```bash
# 使用 ab (Apache Bench)
ab -n 100 -c 10 http://localhost:3000/

# 或使用 wrk
wrk -t4 -c100 -d30s http://localhost:3000/
```

## 自动化测试脚本

创建 `test-urls.sh`:

```bash
#!/bin/bash

echo "🧪 测试 URL 重写功能..."

BASE_URL="http://localhost:3000"

# 测试根路径
echo "1. 测试根路径 /"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/)
if [ $STATUS -eq 200 ]; then
    echo "✅ 根路径返回 200"
else
    echo "❌ 根路径返回 $STATUS"
fi

# 测试 /en
echo "2. 测试 /en"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/en)
if [ $STATUS -eq 200 ]; then
    echo "✅ /en 返回 200"
else
    echo "❌ /en 返回 $STATUS"
fi

# 测试 /zh
echo "3. 测试 /zh"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/zh)
if [ $STATUS -eq 200 ]; then
    echo "✅ /zh 返回 200"
else
    echo "❌ /zh 返回 $STATUS"
fi

# 测试子路径
echo "4. 测试 /blog"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/blog)
if [ $STATUS -eq 200 ]; then
    echo "✅ /blog 返回 200"
else
    echo "❌ /blog 返回 $STATUS"
fi

echo "✅ 测试完成！"
```

运行测试:
```bash
chmod +x test-urls.sh
./test-urls.sh
```

## 总结

完成以上测试后，你应该确认：

- ✅ 访问 `/` 显示英文内容，URL 不变
- ✅ 访问 `/en` 显示英文内容
- ✅ 访问 `/zh` 显示中文内容
- ✅ 没有不必要的重定向
- ✅ 所有页面正常加载
- ✅ 静态资源正常加载

如果所有测试通过，说明 URL 重写功能工作正常！🎉

---

测试时间: 2026年3月1日
策略: URL Rewrite（重写）
