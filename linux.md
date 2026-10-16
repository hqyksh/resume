issac@DESKTOP-4ANIEFL MINGW64 /f/resume/.next (main)

cd .next/standalone
cp -r ../static .next/static
cp -r ../../public ./public

tar -czf app.tar.gz ./standalone/

sudo tar -xzf app.tar.gz

ssh -p 2222 -i resumekey.pem ubuntu@47/tmp.129.237.106
scp -P 2222 -i resumekey.pem app.tar.gz ubuntu@47.129.237.106:/tmp






====================================================================
pm2 delete all
pm2 start server.js --name next-app --restart-delay 3000 --max-restarts 10 --min-uptime 10s


pm2 start npm --name "my-next-app" -- start

pm2 start server.js --name next-app

# 基本语法：当内存超过指定值时自动重启
pm2 start server.js --name "api-server" --max-memory-restart 512M

# 方式1：命令行直接限制
pm2 start app.js --name "api" --max-memory-restart 400M --restart-delay 3000

# 方式2：结合 Node.js 内存参数
pm2 start app.js --node-args="--max-old-space-size=512" --max-memory-restart 600M

# 方式3：集群模式 + 内存限制（生产环境推荐）
pm2 start app.js -i max --max-memory-restart 500M


# 实时监控内存和 CPU
pm2 monit

# 查看详细状态（含内存使用）
pm2 status
pm2 show app_name             # 查看单个应用详情

# 内存日志分析
pm2 logs app_name --lines 100

# 保存当前配置（开机自启）
pm2 save
pm2 startup                   # 生成开机启动脚本



# 启动并限制内存
pm2 start app.js --max-memory-restart 500M

# 停止应用
pm2 stop all                  # 停止所有
pm2 delete all                # 删除所有

# 查看内存使用
pm2 status                    # 简览
pm2 monit                     # 实时监控




基础停止命令
bash
复制
pm2 stop <id|name|all>        # 停止（保留在进程列表中）
pm2 delete <id|name|all>      # 删除（从进程列表中移除）
pm2 kill                      # 停止所有并关闭 PM2 守护进程
具体示例
bash
复制
# 停止特定应用
pm2 stop app_name             # 按名称停止
pm2 stop 0                    # 按 ID 停止
pm2 stop api-server           # 按自定义名称停止

# 停止多个
pm2 stop app1 app2 app3       # 停止多个指定应用
pm2 stop all                  # 停止所有应用

# 删除应用（彻底移除）
pm2 delete app_name           # 删除单个
pm2 delete all                # 删除所有

# 重启（先停后启）
pm2 restart app_name          # 重启应用
pm2 reload app_name           # 0 停机重启（集群模式推荐）



====================================================================

setsid 

====================================================================


登录
ssh -i resume.pem ec2-user@3.112.45.67
ssh -i resumekey.pem ubuntu@13.213.10.83

df -h
Filesystem       Size  Used Avail Use% Mounted on
/dev/root        6.8G  2.3G  4.5G  34% /

查看当前目录的总大小
du -sh

查看当前目录下子目录分别的大小
$du -h

查看内存使用情况
free -h


本地开发sql数据全连接授权才行
CREATE USER 'root'@'192.168.0.107' IDENTIFIED BY 'xxx';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.0.107' WITH GRANT OPTION;
FLUSH PRIVILEGES;



上线时执行 npm ci --only=production 就自动跳过热重启。
git clone <repo>
cd lyjh-api
npm ci --only=production
cp ~/secrets/.env.production .env
# 用 systemd / PM2 / Docker 任选一个守护
pm2 start ./bin/www --name lyjh-api


服务器和数据库同云同区，图片/静态资源随便挑一家便宜又快的对象存储 + CDN 即可。

安装nextjs项目
pm2 start npm --name "resume" -- run start

standalone模式
npm ci && npm run build

cp -r public .next/standalone/ \
&& cp -r .next/static .next/standalone/.next/

方式1
cd .next/standalone
PORT=3000 HOSTNAME=0.0.0.0 node server.js

方式2
cd .next/standalone
pm2 start server.js --name next-app

pm2 start npm --name next-app -- run start

cd .next/standalone
NODE_OPTIONS="--max-old-space-size=384" pm2 start server.js --name next-app

pm2 logs nextjs

安装nginx
sudo nginx -t && sudo systemctl reload nginx
pm2 start npm --name "resume" -- run start

清理内存
sudo sh -c 'echo 3 > /proc/sys/vm/drop_caches'
查看内存
ps -eo pid,ppid,cmd,%mem,rss --sort=-%mem | head -20

安装meilisearch
curl -L https://github.com/meilisearch/meilisearch/releases/download/v1.9.0/meilisearch-linux-amd64 --output meilisearch
chmod +x meilisearchch
nohup ./meilisearch  --http-addr 0.0.0.0:7700 --master-key=f8rq2Pf0lFJHac_Twp6n66Ty1JTys3UXaoB_Fwk9j1Y > meilisearch.log 2>&1 &

curl -X GET 'http://127.0.0.1:7700/indexes'
sudo ufw allow 7700/tcp
sudo ufw reload
sudo pkill meilisearch
如果用 systemd 服务，把 
/etc/systemd/system/meilisearch.service 里

ExecStart= 那一行改成
ExecStart=/usr/local/bin/meilisearch --http-addr 0.0.0.0:7700 --master-key=${MEILI_MASTER_KEY}
sudo systemctl daemon-reload
sudo systemctl restart meilisearch


scp -i temp-key.pem ubuntu@18.139.1.234:~/nginx-backup.tgz ./ 拉到本地，

====================================================================

安装redis
sudo apt install redis-server -y

RedisInsight
用内网ip链接redis

====================================================================
/etc/docker/daemon.json

docker
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1panel.live",
    "https://hub.rat.dev",
    "https://docker.mirrors.sjtug.sjtu.edu.cn",
    "https://docker.nju.edu.cn"
  ],
  "dns": ["114.114.114.114", "8.8.8.8"]
}



====================================================================

安装RabbitMQ 

sudo apt install -y rabbitmq-server

# 开机自启
sudo systemctl enable rabbitmq-server


# 重启服务
sudo systemctl restart rabbitmq-server

# 查看所有用户
sudo rabbitmqctl list_users

# 查看队列
sudo rabbitmqctl list_queues

# 查看连接
sudo rabbitmqctl list_connections

# 查看状态
sudo rabbitmqctl status

# 开放端口
sudo ufw allow 5672/tcp   # AMQP
sudo ufw allow 15672/tcp  # 管理界面
sudo ufw reload


admin1
admin123645





====================================================================

ubuntu@ip-172-31-20-60:/var/www$ history
    1  ls
    2  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    3  sudo apt-get install -y nodejs
    4  node -v
    5  npm -v
    6  npm --verison
    7  sudo apt update
    8  sudo apt install nginx -y
    9  sudo systemctl enable nginx
   10  ls
   11  pwd
   12  cd /var
   13  ls
   14  cd www
   15  ls
   16  mkdir resume
   17  ls
   18  sudo mkdir resume
   19  ls
   20  ll
   21  cd html
   22  ls
   23  cd ..
   24  cd resume
   25  ls
   26  ls -lh
   27  ls -dh
   28  cd /var/www/
   29  ls
   30  cd resume/
   31  df -h
   32  du -sh
   33  du -h
   34  cd ..
   35  du -h
   36  du -sh
   37  df -Th
   38  df -h
   39  ls -lh
   40  ls -lhS
   41  df -h
   42  free -h
   43  du -sh * | sort -hr
   44  ps -eo pid,ppid,cmd,%mem,rss --sort=-%mem | head -20
   45  cd /www
   46  ls
   47  cd /var/www/resume/
   48  ls
   49  cd ..
   50  ll
   51  chmod 775 resume/
   52  sudo chmod 775 resume/
   53  ll
   54  sudo chmod 777 resume/
   55  ls
   56  ll
   57  cd resume/
   58  sl
   59  ls
   60  unzip standalone.zip
   61  tar
   62  tar --help
   63  ls
   64  tar -xzf app.tar.gz
   65  ls
   66  rm standalone.zip
   67  ls
   68  cd standalone/
   69  ls
   70  pm2 start server.js --name next-app
   71  sudo npm install -g pm2
   72  pm2 start server.js --name next-app
   73  free -h
   74  pm2 list
   75  ls
   76  cd /etc/
   77  ls
   78  cd nginx/
   79  ls
   80  pm2 list
   81  ls
   82  cd /var/www/resume/
   83  ls
   84  mv nginx.simple.conf nginx.conf
   85  cp nginx.conf /etc/nginx/sites-available/nextjs-app
   86  sudo cp nginx.conf /etc/nginx/sites-available/nextjs-app
   87  sudo nginx -t
   88  cd /etc/nginx/
   89  cd sites-available/
   90  ls
   91  cd nextjs-app
   92  vi nextjs-app
   93  sudo vi nextjs-app
   94  sudo nginx -t
   95  sudo cp nginx.conf /etc/nginx/sites-available/nextjs-app
   96  sudo ln -sf /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/
   97  sudo systemctl reload nginx
   98  cd /etc/
   99  ls
  100  cd nginx/
  101  ls
  102  cd conf.d/
  103  ls
  104  cd ../sites-available/
  105  ls
  106  cat nextjs-app
  107  cd ../
  108  ls
  109  cd sites-enabled/
  110  ls
  111  cat nextjs-app
  112  q
  113  sudo nginx -s reload
  114  sudo nginx -T | grep server_name
  115  sudo nginx -T | grep -E "server_name|listen"
  116  cd /www
  117  cd /var
  118  cd www
  119  ls
  120  cd resume/
  121  ls
  122  sudo vi nginx.conf
  123  cat nginx.conf
  124  sudo cp nginx.conf /etc/nginx/sites-available/nextjs-app
  125  sudo ln -sf /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/
  126  sudo nginx -t
  127  cd /etc/nginx/
  128  ls
  129  sudo vi nginx.conf
  130  cd conf.d/
  131  ls
  132  cd ..
  133  sudo vi nginx.conf
  134  cd sites-enabled/
  135  ls
  136  sudo vi default
  137  mv default ../
  138  sudo mv default ../default.bak
  139  ls
  140  sudo nginx -t
  141  sudo systemctl reload nginx
  142  systemctl daemon-reload
  143  sudo systemctl daemon-reload
  144  sudo systemctl reload nginx
  145  free -h
  146  pm2 list
  147  pwd
  148  cd /var
  149  ls
  150  cd www
  151  ls
  152  cd ..
  153  cd tmp
  154  ls
  155  cd ..
  156  ls
  157  cd tmp
  158  ls
  159  ll
  160  cd ..
  161  ls
  162  cd www
  163  ls
  164  cd /var/www/
  165  ls
  166  cd resume/
  167  ls
  168  node sync-meili.js
  169  ip addr show | grep inet6
  170  curl -6 http://ifconfig.me
  171  ls
  172  rm sync-meili.js
  173  ls
  174  free -h
  175  pm2 list
  176  ls
  177  cd /var
  178  ls
  179  cd www
  180  pm2 list
  181  nginx -t
  182  show logs
  183  show log
  184  history






ubuntu@ip-172-31-37-90:/var/www/resume/standalone$ ll
total 44
drwxr-xr-x  5 ubuntu ubuntu 4096 Mar 27 09:13 ./
drwxr-xr-x  3 root   root   4096 Mar 25 03:58 ../
-rw-r--r--  1 ubuntu ubuntu  453 Mar 25 02:30 .env
drwxr-xr-x  5 ubuntu ubuntu 4096 Mar 25 05:15 .next/
-rw-rw-rw-  1 root   root     41 Mar 25 04:02 .npmrc
-rw-r--r--  1 ubuntu ubuntu 3573 Mar 25 03:45 nginx.conf
drwxr-xr-x 18 ubuntu ubuntu 4096 Mar 25 03:16 node_modules/
-rw-r--r--  1 ubuntu ubuntu 1420 Mar 25 03:16 package.json
drwxr-xr-x  6 ubuntu ubuntu 4096 Mar 25 03:52 public/
-rw-rw-r--  1 ubuntu ubuntu    0 Mar 27 09:13 scanner_linux
-rw-r--r--  1 ubuntu ubuntu 6460 Mar 25 03:16 server.js
-rw-rw-r--  1 ubuntu ubuntu    0 Mar 27 08:26 xmrig.tar.gz




