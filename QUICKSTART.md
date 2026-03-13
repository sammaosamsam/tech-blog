# 快速开始指南

## 方式1: 使用部署脚本（推荐）

### Windows用户

```cmd
cd tech-blog
scripts\deploy.bat
```

### Linux/Mac用户

```bash
cd tech-blog
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

脚本会自动完成以下操作：
1. 初始化Git仓库
2. 添加所有文件
3. 提交更改
4. 推送到GitHub
5. 触发GitHub Actions自动构建Docker镜像

## 方式2: 手动部署

### 步骤1: 初始化Git仓库

```bash
cd tech-blog
git init
```

### 步骤2: 添加远程仓库

```bash
# 使用HTTPS
git remote add origin https://github.com/<your-username>/<repo-name>.git

# 或使用SSH
git remote add origin git@github.com:<your-username>/<repo-name>.git
```

### 步骤3: 提交并推送

```bash
git add .
git commit -m "Add Docker support and deployment configuration"
git branch -M main
git push -u origin main
```

### 步骤4: 等待自动构建

推送成功后，GitHub Actions会自动：
- 构建Docker镜像
- 推送到GitHub Container Registry

构建过程大约需要5-10分钟。

### 步骤5: 查看构建状态

1. 访问你的GitHub仓库
2. 点击"Actions"标签
3. 查看"Build and Push Docker Image"工作流状态

## 方式3: 本地Docker部署（不推送到GitHub）

如果你想先在本地测试，可以不推送到GitHub：

### 构建Docker镜像

```bash
cd tech-blog
docker build -t tech-blog:local .
```

### 运行容器

```bash
docker run -d \
  --name tech-blog-app \
  -p 5000:5000 \
  -v $(pwd)/data:/app/backend/data \
  --restart unless-stopped \
  tech-blog:local
```

### 访问应用

打开浏览器访问 `http://localhost:5000`

### 停止和清理

```bash
docker stop tech-blog-app
docker rm tech-blog-app
docker rmi tech-blog:local
```

## 验证部署

### 检查容器状态

```bash
docker ps
```

### 查看容器日志

```bash
docker logs -f tech-blog-app
```

### 测试健康检查

```bash
curl http://localhost:5000/health
```

### 访问应用

- 前端: `http://localhost:5000`
- 登录页: `http://localhost:5000/login`
- 后台管理: `http://localhost:5000/admin`

### 默认登录凭据

- 用户名: `admin`
- 密码: `admin123`

## 从GitHub拉取镜像部署

如果你已经推送到了GitHub，可以直接拉取镜像：

```bash
# 登录到GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u <your-username> --password-stdin

# 拉取最新镜像
docker pull ghcr.io/<your-username>/<repo-name>/tech-blog:latest

# 运行容器
docker run -d \
  --name tech-blog-app \
  -p 5000:5000 \
  -v $(pwd)/data:/app/backend/data \
  --restart unless-stopped \
  ghcr.io/<your-username>/<repo-name>/tech-blog:latest
```

## 使用docker-compose部署

### 修改docker-compose.yml

将镜像名称改为你的GitHub镜像：

```yaml
version: '3.8'

services:
  tech-blog:
    image: ghcr.io/<your-username>/<repo-name>/tech-blog:latest
    container_name: tech-blog-app
    ports:
      - "5000:5000"
    volumes:
      - ./data:/app/backend/data
    restart: unless-stopped
```

### 启动服务

```bash
docker-compose pull
docker-compose up -d
```

## 常见问题

### Q: 推送失败，提示认证错误？

**A**: 确保你使用正确的GitHub凭据：
- HTTPS方式需要GitHub个人访问令牌
- SSH方式需要配置SSH密钥

### Q: GitHub Actions构建失败？

**A**: 检查以下几点：
1. 仓库设置中是否启用了Actions和Packages权限
2. Dockerfile语法是否正确
3. 依赖文件是否完整

### Q: 无法访问localhost:5000？

**A**: 检查：
1. 容器是否正在运行 (`docker ps`)
2. 端口映射是否正确 (`docker ps`)
3. 防火墙是否阻止了连接

### Q: 如何修改默认密码？

**A**: 编辑 `backend/index.js` 中的用户配置，然后重新构建镜像。

### Q: 数据会持久保存吗？

**A**: 是的，数据存储在 `data/` 目录中，通过Docker卷挂载保持持久化。

## 下一步

- 阅读 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解详细的部署和配置选项
- 阅读 [DOCKER.md](./DOCKER.md) 了解GitHub和Docker的集成
- 根据需要自定义配置和功能

## 获取帮助

如有问题，请：
1. 查看GitHub Actions日志
2. 查看容器日志 (`docker logs tech-blog-app`)
3. 提交Issue到GitHub仓库
