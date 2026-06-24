#!/bin/bash

# Next.js 多语言项目部署脚本

set -e

echo "🚀 开始部署 Next.js 应用..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js 版本: $(node -v)${NC}"

# 1. 安装依赖
echo -e "${YELLOW}📦 安装依赖...${NC}"
npm ci --only=production

# 2. 构建项目
echo -e "${YELLOW}🔨 构建项目...${NC}"
npm run build

# 3. 准备 standalone 文件
echo -e "${YELLOW}📁 准备部署文件...${NC}"
cd .next/standalone

# 复制静态文件
echo -e "${YELLOW}📋 复制静态文件...${NC}"
cp -r ../static .next/static
cp -r ../../public ./public

# 4. 使用 PM2 部署
if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}🔄 使用 PM2 重启应用...${NC}"
    cd ../..
    pm2 delete nextjs-app 2>/dev/null || true
    pm2 start ecosystem.config.js
    pm2 save
    echo -e "${GREEN}✓ PM2 部署完成${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 未安装，跳过 PM2 部署${NC}"
    echo -e "${YELLOW}💡 提示: 运行 'npm install -g pm2' 安装 PM2${NC}"
fi

# 5. 配置 Nginx
if command -v nginx &> /dev/null; then
    echo -e "${YELLOW}🔧 配置 Nginx...${NC}"
    
    # 检查配置文件是否存在
    if [ -f "nginx.conf" ]; then
        sudo cp nginx.conf /etc/nginx/sites-available/nextjs-app
        sudo ln -sf /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/
        
        # 测试配置
        if sudo nginx -t; then
            echo -e "${GREEN}✓ Nginx 配置测试通过${NC}"
            sudo systemctl reload nginx
            echo -e "${GREEN}✓ Nginx 已重启${NC}"
        else
            echo -e "${RED}❌ Nginx 配置测试失败${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}⚠️  nginx.conf 文件不存在${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Nginx 未安装，跳过 Nginx 配置${NC}"
fi

echo ""
echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "📝 访问地址:"
echo "  - http://localhost:3000 (Next.js 直接访问)"
echo "  - http://your-domain.com (通过 Nginx)"
echo ""
echo "🔍 查看日志:"
echo "  - PM2: pm2 logs nextjs-app"
echo "  - Nginx: tail -f /var/log/nginx/nextjs_access.log"
echo ""
echo "🛠️  管理命令:"
echo "  - 重启应用: pm2 restart nextjs-app"
echo "  - 停止应用: pm2 stop nextjs-app"
echo "  - 查看状态: pm2 status"
