# GitHub + Docker 部署指南

## 推送到GitHub

### 前提条件

1. 创建GitHub仓库
2. 配置GitHub个人访问令牌（PAT）
3. 启用GitHub Container Registry

### 步骤1: 初始化Git仓库

```bash
cd tech-blog
git init
git add .
git commit -m "Initial commit - Add Docker support"
```

### 步骤2: 添加远程仓库

```bash
# 方式1: 使用HTTPS
git remote add origin https://github.com/<your-username>/<repo-name>.git

# 方式2: 使用SSH
git remote add origin git@github.com:<your-username>/<repo-name>.git
```

### 步骤3: 推送到GitHub

```bash
# 首次推送（设置main分支为默认分支）
git branch -M main
git push -u origin main
```

### 步骤4: 配置GitHub Actions

GitHub Actions会自动构建并推送Docker镜像到GitHub Container Registry。

**重要**: 确保在GitHub仓库设置中启用了：
- Actions权限
- Packages权限（用于Container Registry）

### 步骤5: 验证构建

1. 访问GitHub仓库
2. 点击"Actions"标签
3. 查看构建工作流状态
4. 构建成功后，镜像将推送到 `ghcr.io/<your-username>/<repo-name>/tech-blog`

## 从GitHub Container Registry拉取镜像

### 认证到GitHub Container Registry

```bash
# 使用GitHub个人访问令牌
echo $GITHUB_TOKEN | docker login ghcr.io -u <your-username> --password-stdin

# 或使用GitHub令牌（在GitHub Actions中自动使用）
docker login ghcr.io -u ${{ github.actor }} -p ${{ secrets.GITHUB_TOKEN }}
```

### 拉取镜像

```bash
# 拉取最新版本
docker pull ghcr.io/<your-username>/<repo-name>/tech-blog:latest

# 拉取特定版本
docker pull ghcr.io/<your-username>/<repo-name>/tech-blog:main-abc123
```

### 运行容器

```bash
docker run -d \
  --name tech-blog-app \
  -p 5000:5000 \
  -v $(pwd)/data:/app/backend/data \
  --restart unless-stopped \
  ghcr.io/<your-username>/<repo-name>/tech-blog:latest
```

## 使用docker-compose部署

### 创建docker-compose.yml

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
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s
```

### 启动服务

```bash
docker-compose pull
docker-compose up -d
```

## 镜像标签说明

| 标签 | 说明 |
|-----|------|
| `latest` | 最新稳定版本（默认分支） |
| `main-<commit-sha>` | main分支的特定提交 |
| `main` | main分支的最新版本 |
| `pr-<number>` | Pull Request的版本 |

## GitHub Container Registry使用

### 查看镜像

访问 `https://github.com/users/<your-username>/packages/container/tech-blog`

### 删除旧镜像

1. 访问Container Registry页面
2. 选择要删除的镜像版本
3. 点击"Delete package version"

### 设置镜像为公开

1. 访问仓库设置
2. 选择"Actions" -> "General"
3. 启用"Workflow permissions"的读写权限

## CI/CD工作流

### 自动构建触发条件

- 推送到 `main` 分支
- 推送到 `master` 分支
- 创建Pull Request

### 手动触发构建

在GitHub界面中：
1. 进入"Actions"标签
2. 选择"Build and Push Docker Image"工作流
3. 点击"Run workflow"

### 构建输出

- **状态**: 在Actions页面查看构建进度
- **镜像**: 成功后自动推送到Container Registry
- **日志**: 点击具体的工作流查看详细日志

## 本地测试构建

在推送之前，可以本地测试Docker构建：

```bash
# 构建镜像
docker build -t tech-blog:local .

# 运行容器
docker run -d -p 5000:5000 --name tech-blog-test tech-blog:local

# 测试访问
curl http://localhost:5000/health

# 查看日志
docker logs -f tech-blog-test

# 清理
docker stop tech-blog-test
docker rm tech-blog-test
docker rmi tech-blog:local
```

## 多平台支持

GitHub Actions配置了多平台构建，支持：
- linux/amd64
- linux/arm64

这意味着镜像可以在不同架构的机器上运行，包括：
- 标准x86服务器
- ARM设备（如树莓派、Apple Silicon Mac）

## 故障排查

### 构建失败

1. 检查Actions日志中的错误信息
2. 确认所有依赖都正确配置
3. 检查文件权限

### 推送失败

1. 确认GitHub Token有足够的权限
2. 检查仓库是否启用了Packages功能
3. 验证Container Registry配置

### 拉取失败

1. 确认已正确认证到GitHub Container Registry
2. 检查镜像名称和标签是否正确
3. 验证网络连接

## 安全最佳实践

1. **使用环境变量**: 不要在代码中硬编码敏感信息
2. **定期更新**: 保持依赖和基础镜像最新
3. **扫描漏洞**: 使用Docker Scout扫描镜像漏洞
4. **最小权限**: 给GitHub Token分配最小必要权限

## 相关文档

- [GitHub Actions文档](https://docs.github.com/en/actions)
- [GitHub Container Registry文档](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker官方文档](https://docs.docker.com/)
- [项目部署文档](./DEPLOYMENT.md)

## 许可证

本项目遵循MIT许可证。
