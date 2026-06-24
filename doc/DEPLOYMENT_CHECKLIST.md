# 部署检查清单

## 部署前准备

### 1. 环境检查
- [ ] Node.js 18+ 已安装
- [ ] npm 或 yarn 已安装
- [ ] PM2 已安装（可选）：`npm install -g pm2`
- [ ] Nginx 已安装（可选）
- [ ] 服务器有足够的内存（建议 2GB+）

### 2. 代码准备
- [ ] 所有代码已提交到 Git
- [ ] `.env.production` 文件已配置
- [ ] 生产环境的 Supabase 凭证已设置
- [ ] `next.config.ts` 中的域名已更新

### 3. 构建测试
```bash
# 本地测试构建
npm run build
npm run start

# 测试访问
curl http://localhost:3000
curl http://localhost:3000/en
curl http://localhost:3000/zh
```

## 部署方式选择

### 方式一：使用部署脚本（推荐）

```bash
chmod +x deploy.sh
./deploy.sh
```

### 方式二：手动部署

#### Step 1: 构建
```bash
npm ci --only=production
npm run build
```

#### Step 2: 准备文件
```bash
cd .next/standalone
cp -r ../static .next/static
cp -r ../../public ./public
```

#### Step 3: 启动服务
```bash
# 使用 PM2
pm2 start ecosystem.config.js

# 或直接运行
node server.js
```

#### Step 4: 配置 Nginx
```bash
sudo cp nginx.conf /etc/nginx/sites-available/nextjs-app
sudo ln -s /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 方式三：Docker 部署

```bash
# 构建镜像
docker build -t nextjs-app .

# 使用 Docker Compose
docker-compose up -d

# 查看日志
docker-compose logs -f
```

## 部署后验证

### 1. 服务检查
- [ ] Next.js 服务运行正常：`pm2 status` 或 `docker ps`
- [ ] Nginx 运行正常：`sudo systemctl status nginx`
- [ ] 端口监听正常：`netstat -tlnp | grep 3000`

### 2. 功能测试
- [ ] 访问根路径自动重定向：`curl -I http://your-domain.com`
- [ ] 英文版本正常：`curl http://your-domain.com/en`
- [ ] 中文版本正常：`curl http://your-domain.com/zh`
- [ ] 静态资源加载正常
- [ ] API 路由正常工作

### 3. 性能检查
- [ ] 页面加载时间 < 3秒
- [ ] 静态资源有缓存头
- [ ] Gzip 压缩已启用

### 4. 安全检查
- [ ] HTTPS 已配置（生产环境必须）
- [ ] 安全头已设置（X-Frame-Options 等）
- [ ] 环境变量未暴露
- [ ] 防火墙规则已配置

## 监控设置

### 1. 日志监控
```bash
# PM2 日志
pm2 logs nextjs-app

# Nginx 访问日志
tail -f /var/log/nginx/nextjs_access.log

# Nginx 错误日志
tail -f /var/log/nginx/nextjs_error.log
```

### 2. 性能监控
```bash
# PM2 监控
pm2 monit

# 系统资源
htop
```

### 3. 错误追踪
- [ ] 配置错误追踪服务（如 Sentry）
- [ ] 设置告警通知
- [ ] 定期检查日志

## 常见问题

### 1. 404 错误
**原因**: 路由配置问题或文件缺失
**解决**:
```bash
# 检查文件是否完整
ls -la .next/standalone
ls -la .next/standalone/.next/static
ls -la .next/standalone/public

# 重新构建
npm run build
```

### 2. 语言重定向不工作
**原因**: 中间件未正确部署或 Nginx 配置问题
**解决**:
```bash
# 检查中间件
cat .next/standalone/middleware.js

# 检查 Nginx 配置
sudo nginx -t
```

### 3. 静态资源 404
**原因**: 文件路径不正确
**解决**:
```bash
# 确保复制了静态文件
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
```

### 4. 内存不足
**原因**: 服务器内存太小
**解决**:
```javascript
// ecosystem.config.js
max_memory_restart: '1G', // 调整内存限制
instances: 2, // 减少实例数
```

## 回滚计划

如果部署出现问题：

```bash
# 使用 PM2 回滚
pm2 delete nextjs-app
pm2 start previous-version/server.js --name nextjs-app

# 使用 Git 回滚
git checkout previous-commit
npm run build
./deploy.sh

# 使用 Docker 回滚
docker-compose down
docker-compose up -d previous-image
```

## 更新部署

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新部署
./deploy.sh

# 3. 验证
curl http://your-domain.com
```

## 备份建议

- [ ] 定期备份数据库
- [ ] 备份环境变量文件
- [ ] 备份 Nginx 配置
- [ ] 备份 SSL 证书

## 联系信息

- 开发者: Victor Zhou
- Email: alexy55@163.com
- 文档: 查看 `doc/NGINX_DEPLOYMENT.md`

---

部署完成后，记得更新此清单并保存部署记录！
