# Nginx 部署指南 - Next.js 多语言项目

## 架构说明

本项目使用 **Next.js 中间件** 处理多语言逻辑，Nginx 作为反向代理。

### 语言处理流程

```
用户请求 → Nginx → Next.js 中间件 → 语言检测/重定向 → 页面渲染
```

1. **用户访问 `/`** → 中间件检测浏览器语言 → 重定向到 `/en` 或 `/zh`
2. **用户访问 `/en`** → 直接显示英文内容
3. **用户访问 `/zh`** → 直接显示中文内容

## Nginx 配置选项

### 方案一：完整配置（推荐）

使用 `nginx.conf`，包含：
- 语言检测映射
- 静态资源缓存优化
- 安全头配置
- Gzip 压缩
- 健康检查

### 方案二：简化配置

使用 `nginx.simple.conf`，让 Next.js 中间件处理所有逻辑。

## 部署步骤

### 1. 构建 Next.js 项目

```bash
# 构建生产版本
npm run build

# 测试生产构建
npm run start
```

### 2. 使用 Standalone 模式部署

项目已配置 `output: 'standalone'`，构建后会生成独立的服务器：

```bash
# 构建后的文件在 .next/standalone/
cd .next/standalone

# 复制静态文件
cp -r ../static .next/static
cp -r ../../public ./public

# 启动服务器
node server.js
```

### 3. 配置 Nginx

#### 复制配置文件

```bash
# 使用完整配置
sudo cp nginx.conf /etc/nginx/sites-available/nextjs-app

# 或使用简化配置
sudo cp nginx.simple.conf /etc/nginx/sites-available/nextjs-app

# 创建软链接
sudo ln -s /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 修改配置

编辑 `/etc/nginx/sites-available/nextjs-app`：

```nginx
# 修改域名
server_name your-domain.com;

# 修改 Next.js 服务器地址（如果不是 localhost:3000）
upstream nextjs_upstream {
    server 127.0.0.1:3000;  # 修改为实际地址
}
```

### 4. 使用 PM2 管理 Next.js 进程

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
cd .next/standalone
pm2 start server.js --name nextjs-app

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs nextjs-app

# 重启应用
pm2 restart nextjs-app
```

### 5. 配置 HTTPS（可选但推荐）

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

## 环境变量配置

创建 `.env.production` 文件：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_production_key

# 其他环境变量
NODE_ENV=production
```

## 测试部署

### 1. 本地测试

```bash
# 构建
npm run build

# 启动生产服务器
npm run start

# 测试访问
curl http://localhost:3000
curl http://localhost:3000/en
curl http://localhost:3000/zh
```

### 2. 服务器测试

```bash
# 测试 Nginx 配置
sudo nginx -t

# 测试 Next.js 服务
curl http://localhost:3000

# 测试通过 Nginx 访问
curl http://your-domain.com
curl http://your-domain.com/en
curl http://your-domain.com/zh
```

## 性能优化

### 1. Nginx 缓存配置

```nginx
# 在 http 块中添加
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=nextjs_cache:10m max_size=1g inactive=60m use_temp_path=off;

# 在 location 块中使用
location / {
    proxy_cache nextjs_cache;
    proxy_cache_valid 200 10m;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    # ... 其他配置
}
```

### 2. 静态资源 CDN

考虑将静态资源上传到 CDN：

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.your-domain.com' 
    : '',
  // ...
};
```

## 监控和日志

### 查看 Nginx 日志

```bash
# 访问日志
tail -f /var/log/nginx/nextjs_access.log

# 错误日志
tail -f /var/log/nginx/nextjs_error.log
```

### 查看 Next.js 日志

```bash
# PM2 日志
pm2 logs nextjs-app

# 或直接查看输出
tail -f ~/.pm2/logs/nextjs-app-out.log
tail -f ~/.pm2/logs/nextjs-app-error.log
```

## 故障排查

### 1. 404 错误

检查：
- Next.js 服务是否运行：`pm2 status`
- Nginx 配置是否正确：`sudo nginx -t`
- 端口是否正确：`netstat -tlnp | grep 3000`

### 2. 语言重定向不工作

检查：
- 中间件是否正确部署
- Nginx 是否传递了 `Accept-Language` 头
- 浏览器开发者工具查看重定向

### 3. 静态资源 404

确保：
- 复制了 `.next/static` 和 `public` 文件夹
- Nginx 配置中的路径正确

## Docker 部署（可选）

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine AS base

# 依赖阶段
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 运行阶段
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

使用 Docker Compose：

```yaml
# docker-compose.yml
version: '3.8'
services:
  nextjs:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - nextjs
    restart: unless-stopped
```

## 安全建议

1. **使用 HTTPS**：强制使用 SSL/TLS
2. **限制请求速率**：防止 DDoS 攻击
3. **隐藏版本信息**：`server_tokens off;`
4. **配置防火墙**：只开放必要端口
5. **定期更新**：保持系统和依赖最新

## 参考资源

- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [PM2 文档](https://pm2.keymetrics.io/docs/)

---

部署完成后，访问你的域名应该能看到：
- `http://your-domain.com` → 自动重定向到 `/en` 或 `/zh`
- `http://your-domain.com/en` → 英文版本
- `http://your-domain.com/zh` → 中文版本
