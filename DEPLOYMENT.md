# Docker 部署指南

## 项目概述

这是一个技术博客系统的完整Docker化部署方案，包含前端（React + TypeScript + Vite）和后端（Node.js + Express）。

## 系统要求

- Docker Engine 20.10+
- Docker Compose 2.0+
- 至少 2GB 可用内存
- 至少 2GB 可用磁盘空间

## 快速开始

### 1. 使用 Docker Compose（推荐）

```bash
# 克隆仓库
git clone <your-repo-url>
cd tech-blog

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 停止并删除数据
docker-compose down -v
```

服务将在 `http://localhost:5000` 上运行。

### 2. 使用 Docker 直接构建

```bash
# 构建镜像
docker build -t tech-blog:latest .

# 运行容器
docker run -d \
  --name tech-blog-app \
  -p 5000:5000 \
  -v $(pwd)/data:/app/backend/data \
  --restart unless-stopped \
  tech-blog:latest

# 查看日志
docker logs -f tech-blog-app

# 停止容器
docker stop tech-blog-app

# 删除容器
docker rm tech-blog-app
```

## 环境变量

在运行前，您可以修改 `backend/.env` 文件来配置环境变量：

```env
NODE_ENV=production
PORT=5000
```

## 数据持久化

项目使用文件存储来保存文章数据。数据存储在 `data/` 目录中：

- `data/articles.json`: 文章数据
- `data/`: 其他持久化数据

通过Docker卷挂载，数据可以持久保存：

```yaml
volumes:
  - ./data:/app/backend/data
```

## 健康检查

容器包含健康检查机制，每30秒检查一次服务状态：

```bash
# 查看容器健康状态
docker ps
docker inspect tech-blog-app --format='{{.State.Health.Status}}'
```

访问 `http://localhost:5000/health` 可以查看服务健康状态。

## 默认账号

- **用户名**: `admin`
- **密码**: `admin123`

**重要**: 部署后请立即修改默认密码。

## GitHub Container Registry

项目配置了GitHub Actions自动构建和推送Docker镜像到GitHub Container Registry。

### 使用镜像

```bash
# 拉取镜像
docker pull ghcr.io/<username>/tech-blog:latest

# 运行容器
docker run -d \
  --name tech-blog-app \
  -p 5000:5000 \
  -v $(pwd)/data:/app/backend/data \
  --restart unless-stopped \
  ghcr.io/<username>/tech-blog:latest
```

### 本地构建镜像

```bash
# 使用GitHub Container Registry认证
echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u <username> --password-stdin

# 手动构建和推送
docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/<username>/tech-blog:latest --push .
```

## 端口映射

| 容器端口 | 主机端口 | 说明 |
|---------|---------|------|
| 5000    | 5000    | Web服务端口 |

## 目录结构

```
tech-blog/
├── backend/              # 后端代码
│   ├── index.js        # 主入口文件
│   ├── src/            # 源代码
│   ├── package.json    # 依赖配置
│   └── .env            # 环境变量
├── src/                # 前端源代码
├── public/             # 静态资源
├── data/               # 数据持久化目录
├── Dockerfile          # Docker构建文件
├── docker-compose.yml  # Docker Compose配置
└── .dockerignore      # Docker忽略文件
```

## 生产环境建议

### 1. 安全性

- 修改默认管理员密码
- 使用HTTPS（配置反向代理）
- 限制容器资源使用
- 使用非root用户运行容器

### 2. 性能优化

- 配置Nginx作为反向代理
- 启用Gzip压缩
- 配置CDN加速静态资源
- 使用多实例部署和负载均衡

### 3. 监控和日志

- 集成日志收集系统（如ELK）
- 设置监控告警
- 定期备份数据目录

### 4. 反向代理配置示例（Nginx）

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. 使用环境变量配置

```bash
docker run -d \
  --name tech-blog-app \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -v $(pwd)/data:/app/backend/data \
  --restart unless-stopped \
  tech-blog:latest
```

## 故障排查

### 容器无法启动

```bash
# 查看容器日志
docker logs tech-blog-app

# 检查端口占用
netstat -ano | findstr :5000

# 检查文件权限
ls -la data/
```

### 无法访问服务

```bash
# 检查容器状态
docker ps -a

# 进入容器调试
docker exec -it tech-blog-app sh

# 检查服务端口
docker exec tech-blog-app netstat -tlnp
```

### 数据丢失

确保正确挂载了数据卷：

```bash
# 检查卷挂载
docker inspect tech-blog-app | grep -A 10 Mounts

# 备份数据
tar -czf data-backup-$(date +%Y%m%d).tar.gz data/
```

## 更新和升级

### 更新应用

```bash
# 拉取最新镜像
docker pull ghcr.io/<username>/tech-blog:latest

# 停止并删除旧容器
docker-compose down

# 启动新容器
docker-compose up -d

# 或使用docker run
docker stop tech-blog-app
docker rm tech-blog-app
docker run -d --name tech-blog-app -p 5000:5000 -v $(pwd)/data:/app/backend/data --restart unless-stopped ghcr.io/<username>/tech-blog:latest
```

### 零停机更新

```bash
# 启动新容器
docker run -d --name tech-blog-new -p 5001:5000 -v $(pwd)/data:/app/backend/data ghcr.io/<username>/tech-blog:latest

# 验证新容器
curl http://localhost:5001/health

# 切换端口映射
docker stop tech-blog-app
docker start tech-blog-app

# 删除旧容器
docker rm tech-blog-app
```

## 备份和恢复

### 备份数据

```bash
# 备份数据目录
docker run --rm -v $(pwd)/data:/data -v $(pwd)/backup:/backup alpine tar -czf /backup/data-backup-$(date +%Y%m%d-%H%M%S).tar.gz /data
```

### 恢复数据

```bash
# 恢复数据目录
docker run --rm -v $(pwd)/data:/data -v $(pwd)/backup:/backup alpine tar -xzf /backup/data-backup-20240101-120000.tar.gz -C /
```

## 支持和反馈

如有问题，请提交Issue或联系项目维护者。
