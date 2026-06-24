# 1. 看系统日志里有没有暴力破解记录
sudo grep "Failed password\|Invalid user\|Accepted password" /var/log/auth.log | tail -50

# 2. 看有没有异常登录成功
sudo last | head -20

# 3. 看当前开放的端口
sudo ss -tlnp

# 4. 看 Docker 暴露了哪些端口
sudo docker ps --format "table {{.Names}}\t{{.Ports}}"



# 1. 关闭密码登录，只允许密钥
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
echo "PasswordAuthentication no" | sudo tee -a /etc/ssh/sshd_config

# 2. 禁止 root 登录
echo "PermitRootLogin no" | sudo tee -a /etc/ssh/sshd_config

# 3. 重启 SSH 生效（不会断开当前连接）
sudo systemctl restart sshd

# 4. 验证配置
sudo sshd -T | grep -E "passwordauthentication|permitrootlogin"


47.128.222.126


# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装 fail2ban，自动封锁暴力破解 IP
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# 3. 配置 fail2ban
sudo tee /etc/fail2ban/jail.local << 'EOF'
[sshd]
enabled = true
port = ssh
maxretry = 3
bantime = 3600
findtime = 600
EOF
sudo systemctl restart fail2ban

# 4. 开启 ufw 防火墙（只开必要端口）
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable