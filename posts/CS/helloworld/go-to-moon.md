---
title: 试着配梯子
icon: creative
category:
  - 记录
  - 运维
date: 2022-11-02
---

~~we choose to go to the monn~~\
[~~we choose to go to the monn!~~](./why-the-moon.md)

没写的地方是要去整一个 VPS，系统是 debian，还要有个解析到这个服务器的一个域名。

大约是，v2ray 然后用 nginx 做点伪装。

首先是整服务器和域名，放个博客下载站之类的东西，用 nginx 配。

ssl 证书用 certbot 生成。

基本的安装

git 下载 blog 或者别的什么东西

```
apt-get update
apt-get install git -y
apt-get install nginx -y
cd /
mkdir github
cd github
git clone -b vuepress-pages https://github.com/huamurui/huamurui.github.io.git
```

进入 nginx 配置

```
cd /etc/nginx
vim nginx.conf
```

or

```
vim /etc/nginx/nginx.conf
```

重载配置

```
nginx -s reload
```

nginx 具体配置

```json

user www-data;
pid /run/nginx.pid;
worker_processes auto;
worker_rlimit_nofile 51200;

events {
    worker_connections 1024;
    multi_accept on;
    use epoll;
}

http {
    server_tokens off;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 120s;
    keepalive_requests 10000;
    types_hash_max_size 2048;
    include /etc/nginx/mime.types;

    access_log off;
    error_log /dev/null;

    server {
        listen 80;
        listen [::]:80;
        server_name huamurui.me;
        root /github/huamurui.github.io;
        index index.html;

        location /ray {
            proxy_redirect off;
            proxy_pass http://127.0.0.1:10086;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $http_host;
        }
    }

    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        root /github/huamurui.github.io;
        index index.html;

        server_name huamurui.me;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;
        ssl_certificate /etc/letsencrypt/live/huamurui.me/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/huamurui.me/privkey.pem;
        location /ray {
            proxy_redirect off;
            proxy_pass http://127.0.0.1:10086;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}

```

v2fly 下载 yu 客户端配置

```shell
bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
```

```
cd /usr/local/etc/v2ray/
vim config.josn
```

or

```
vim /usr/local/etc/v2ray/config.json
```

v2fly 具体配置

```json
{
  "inbounds": [
    {
      "port": 10086,
      "listen": "127.0.0.1",
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "b831381d-6324-4d53-ad4f-8cda48b30811",
            "alterId": 64
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
          "path": "/ray"
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {
        "domainStrategy": "UseIP"
      }
    }
  ],e
  "dns": {
    "servers": [
      "https+local://1.1.1.1/dns-query",
      "1.1.1.1",
      "8.8.8.8",
      "localhost"
    ]
  }
}
```

---

certbot 安装 ssl 证书

```

apt-get install certbot -y

certbot certonly --webroot -w /github/huamurui.github.io -d huamurui.me
```

others:

修改服务器时区

```
timedatectl set-timezone Asia/Shanghai
```

```
systemctl start nginx
systemctl start v2ray
```

查看端口占用

```
netstat -tulpn | grep xxxx
```
