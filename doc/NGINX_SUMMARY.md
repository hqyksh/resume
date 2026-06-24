# Nginx 多语言配置总结

## 📋 已创建的文件

### 1. Nginx 配置文件
- **`nginx.conf`** - 完整配置（推荐生产环境）
  - 包含语言检测映射
  - 静态资源缓存优化
  - 安全头配置
  - Gzip 压缩

- **`nginx.simple.conf`** - 简化配置
  - 让 Next.js 中间件处理所有逻辑
  - 适合简单部署

### 2. Docker 配置
- **`Dockerfile`** - 多阶段构建配置
- **`.dockerignore`** - Docker 忽略文件
- **`docker-compose.yml`** - Docker Compose 配置

### 3. PM2 配置
- **`ecosystem.config.js`** - PM2 进程管理配置

### 4. 部署工具
- **`deploy.sh`** - 自动化部署脚本

### 5. 文档
- **`doc/NGINX_DEPLOYMENT.md`** - 完整部署指南
- **`doc/DEPLOYMENT_CHECKLIST.md`** - 部署检查清单

## 🎯 多语言实现方案

### 当前架构

```
用户请求 → Nginx → Next.js 中间件 → URL 重写 → 页面渲染
```

### 语言处理流程（使用 URL Rewrite）

1. **访问根路径 `/`**
   - Next.js 中间件将 URL 重写为 `/en`
   - 浏览器地址栏保持 `/`（不变）
   - 显示英文内容（默认语言）

2. **访问 `/en`**
   - 直接显示英文内容
   - URL 保持 `/en`

3. **访问 `/zh`**
   - 直接显示中文内容
   - URL 保持 `/zh`

4. **访问其他路径（如 `/about`）**
   - 根据浏览器语言重写为 `/en/about` 或 `/zh/about`
   - 浏览器地址栏保持 `/about`

### 关键特性

- ✅ **URL 简洁**: 访问 `/` 而不是 `/en`
- ✅ **默认英文**: 未指定语言时默认显示英文
- ✅ **URL 不变**: 使用 rewrite 而非 redirect，URL 保持简洁
- ✅ **灵活切换**: 可以通过 `/en` 或 `/zh` 显式切换语言

### 关键代码

#### middleware.ts（已更新 - 使用 Rewrite）
```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 如果已经有语言前缀，直接放过
  const localeInPath = locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (localeInPath) return NextResponse.next();
  
  // 根路径重写为 /en（URL 不变）
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/en';
    return NextResponse.rewrite(url);
  }
  
  // 其他路径根据语言重写
  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.rewrite(url);
}
```

#### Nginx 配置（nginx.conf）
```nginx
# 语言检测映射
map $http_accept_language $lang {
    default en;
    ~*^zh zh;
    ~*^en en;
}

# 根路径重定向
location = / {
    return 302 /$lang;
}

# 其他请求代理到 Next.js
location / {
    proxy_pass http://nextjs_upstream;
    proxy_set_header Accept-Language $http_accept_language;
}
```

## 🚀 快速部署

### 方式一：使用部署脚本（推荐）

```bash
# 1. 配置环境变量
cp .env.example .env.production
# 编辑 .env.production

# 2. 运行部署脚本
chmod +x deploy.sh
./deploy.sh
```

### 方式二：Docker 部署

```bash
# 1. 构建并启动
docker-compose up -d

# 2. 查看日志
docker-compose logs -f

# 3. 访问
curl http://localhost
```

### 方式三：手动部署

```bash
# 1. 构建
npm run build

# 2. 启动 Next.js
cd .next/standalone
cp -r ../static .next/static
cp -r ../../public ./public
pm2 start server.js --name nextjs-app

# 3. 配置 Nginx
sudo cp nginx.conf /etc/nginx/sites-available/nextjs-app
sudo ln -s /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## ✅ 验证部署

### 1. 测试语言重定向

```bash
# 访问根路径（应该重定向）
curl -I http://your-domain.com

# 应该看到 302 重定向到 /en 或 /zh
```

### 2. 测试英文版本

```bash
curl http://your-domain.com/en
# 应该返回英文页面
```

### 3. 测试中文版本

```bash
curl http://your-domain.com/zh
# 应该返回中文页面
```

### 4. 测试静态资源

```bash
curl -I http://your-domain.com/_next/static/...
# 应该有 Cache-Control 头
```

## 🔧 配置说明

### Nginx 配置要点

1. **upstream 配置**
   ```nginx
   upstream nextjs_upstream {
       server 127.0.0.1:3000;  # Next.js 服务地址
   }
   ```

2. **语言检测**
   ```nginx
   map $http_accept_language $lang {
       default en;
       ~*^zh zh;
   }
   ```

3. **静态资源缓存**
   ```nginx
   location /_next/static {
       add_header Cache-Control "public, max-age=31536000, immutable";
   }
   ```

4. **代理配置**
   ```nginx
   location / {
       proxy_pass http://nextjs_upstream;
       proxy_set_header Accept-Language $http_accept_language;
   }
   ```

### Next.js 配置要点

1. **移除 i18n 配置**（已完成）
   ```typescript
   // ❌ 不要在 App Router 中使用
   // i18n: { locales: ['en', 'zh'], defaultLocale: 'en' }
   ```

2. **使用 standalone 模式**（已配置）
   ```typescript
   output: 'standalone'
   ```

3. **中间件处理语言**（已实现）
   - 检测 Accept-Language
   - 重定向到正确的语言路径

## 📊 性能优化

### 已实现的优化

1. ✅ 静态资源缓存（1年）
2. ✅ Gzip 压缩
3. ✅ 安全头配置
4. ✅ Standalone 模式（减小体积）

### 可选优化

1. **CDN 加速**
   ```typescript
   // next.config.ts
   assetPrefix: 'https://cdn.your-domain.com'
   ```

2. **Redis 缓存**
   - 缓存页面渲染结果
   - 缓存 API 响应

3. **负载均衡**
   ```nginx
   upstream nextjs_upstream {
       server 127.0.0.1:3000;
       server 127.0.0.1:3001;
       server 127.0.0.1:3002;
   }
   ```

## 🔒 安全建议

1. ✅ 使用 HTTPS（生产环境必须）
2. ✅ 配置安全头（已在 nginx.conf 中）
3. ✅ 隐藏服务器版本信息
4. ⚠️ 配置防火墙规则
5. ⚠️ 限制请求速率（防 DDoS）

## 📝 注意事项

### 1. 环境变量
- 生产环境使用 `.env.production`
- 不要提交敏感信息到 Git
- 使用 `.env.example` 作为模板

### 2. 域名配置
- 修改 `nginx.conf` 中的 `server_name`
- 配置 DNS 解析
- 申请 SSL 证书

### 3. 端口配置
- Next.js 默认 3000 端口
- Nginx 默认 80/443 端口
- 确保端口未被占用

### 4. 文件权限
- 确保 Next.js 有读写权限
- Nginx 配置文件需要 root 权限

## 🆘 故障排查

### 问题 1: 404 错误
**症状**: 所有页面都是 404

**解决**:
```bash
# 检查 Next.js 是否运行
pm2 status

# 检查端口
netstat -tlnp | grep 3000

# 重启服务
pm2 restart nextjs-app
```

### 问题 2: 语言重定向不工作
**症状**: 访问 `/` 不重定向

**解决**:
```bash
# 检查中间件
cat .next/standalone/middleware.js

# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 日志
tail -f /var/log/nginx/nextjs_error.log
```

### 问题 3: 静态资源 404
**症状**: 图片、CSS 加载失败

**解决**:
```bash
# 确保复制了静态文件
ls -la .next/standalone/.next/static
ls -la .next/standalone/public

# 重新复制
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
```

## 📚 相关文档

- [NGINX_DEPLOYMENT.md](./NGINX_DEPLOYMENT.md) - 完整部署指南
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - 部署检查清单
- [BUILD_SUCCESS_SUMMARY.md](./BUILD_SUCCESS_SUMMARY.md) - 构建成功总结
- [FIX_I18N_CONFLICT.md](./FIX_I18N_CONFLICT.md) - i18n 冲突修复

## 🎉 总结

现在你有了完整的 Nginx 多语言部署方案：

1. ✅ Nginx 配置文件（完整版和简化版）
2. ✅ Docker 部署配置
3. ✅ PM2 进程管理配置
4. ✅ 自动化部署脚本
5. ✅ 完整的部署文档

**语言处理逻辑**:
- 访问 `/` → 自动重定向到 `/en` 或 `/zh`（根据浏览器语言）
- 访问 `/en` → 显示英文内容
- 访问 `/zh` → 显示中文内容

**部署方式**:
- 使用 `deploy.sh` 一键部署
- 或使用 Docker Compose
- 或手动部署

选择适合你的部署方式，开始部署吧！🚀
