# 技术博客系统

一个基于React、Node.js和Docker的现代化技术博客系统，支持Markdown写作、标签分类、后台管理等功能。

![Docker](https://img.shields.io/badge/docker-support-blue)
![React](https://img.shields.io/badge/React-19.2.4-blue)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)

## ✨ 特性

- 📝 **Markdown写作**: 支持完整的Markdown语法和代码高亮
- 🏷️ **标签分类**: 灵活的标签系统和文章分类
- 🔐 **用户认证**: 完整的登录和管理后台
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🌙 **暗黑模式**: 支持明暗主题切换
- 🐳 **Docker部署**: 一键Docker部署，开箱即用
- 🔄 **CI/CD**: GitHub Actions自动构建和推送镜像
- 📊 **文件存储**: 基于文件的轻量级数据存储

## 🏗️ 技术栈

### 前端
- **框架**: React 19.2.4 + TypeScript 5.9.3
- **构建工具**: Vite 8.0.0
- **路由**: React Router DOM 7.13.1
- **样式**: Tailwind CSS 3.4.0
- **Markdown**: react-markdown + rehype-highlight + remark-gfm

### 后端
- **运行时**: Node.js 20+
- **框架**: Express 5.2.1
- **跨域**: CORS 2.8.6
- **存储**: 文件系统（JSON）

### 部署
- **容器**: Docker
- **编排**: Docker Compose
- **CI/CD**: GitHub Actions
- **镜像仓库**: GitHub Container Registry

## 🚀 快速开始

### 方式1: Docker Compose部署（推荐）

```bash
# 克隆仓库
git clone <your-repo-url>
cd tech-blog

# 启动服务
docker-compose up -d

# 访问应用
open http://localhost:5000
```

### 方式2: 手动Docker部署

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
```

### 方式3: 从GitHub Container Registry拉取

```bash
# 登录GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u <username> --password-stdin

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

**详细部署指南**: [QUICKSTART.md](./QUICKSTART.md)

## 📖 使用指南

### 默认登录凭据

- **用户名**: `admin`
- **密码**: `admin123`

> ⚠️ **安全提示**: 首次部署后请立即修改默认密码！

### 主要功能

#### 文章管理
- 创建、编辑、删除文章
- Markdown实时预览
- 标签管理
- 发布状态控制

#### 前台展示
- 文章列表浏览
- 文章详情阅读
- 标签筛选
- 搜索功能
- 阅读时间显示

#### 后台管理
- 登录认证
- 文章CRUD操作
- AI辅助生成
- 数据统计

## 🛠️ 本地开发

### 前端开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 后端开发

```bash
cd backend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📦 Docker镜像

### 镜像信息

- **镜像名称**: `ghcr.io/<username>/tech-blog`
- **标签**: `latest`, `main`, `main-<commit-sha>`
- **平台**: linux/amd64, linux/arm64

### 自动构建

项目配置了GitHub Actions，会在以下情况自动构建并推送镜像：
- 推送到 `main` 分支
- 推送到 `master` 分支
- 创建Pull Request

### 手动构建

```bash
# 使用GitHub Container Registry
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/<username>/tech-blog:latest \
  --push .
```

## 📚 文档

- [快速开始](./QUICKSTART.md) - 快速部署指南
- [Docker部署](./DEPLOYMENT.md) - 详细的Docker部署说明
- [GitHub部署](./DOCKER.md) - GitHub和Docker集成指南
- [项目概述](./brain/overview.md) - 项目开发和修复记录

## 🔧 配置

### 环境变量

在 `backend/.env` 文件中配置：

```env
NODE_ENV=production
PORT=5000
```

### 端口配置

默认端口为5000，可以在环境变量中修改：

```bash
docker run -d \
  --name tech-blog-app \
  -p 8080:5000 \
  -v $(pwd)/data:/app/backend/data \
  tech-blog:latest
```

### 数据持久化

数据存储在 `data/` 目录中，通过Docker卷挂载保持持久化：

```bash
-v $(pwd)/data:/app/backend/data
```

## 🔍 健康检查

容器内置健康检查机制：

```bash
# 查看健康状态
docker inspect tech-blog-app --format='{{.State.Health.Status}}'

# 手动检查
curl http://localhost:5000/health
```

## 🗂️ 项目结构

```
tech-blog/
├── backend/              # 后端代码
│   ├── index.js        # 主入口文件
│   ├── src/            # 源代码
│   │   ├── routes/     # 路由定义
│   │   └── utils/      # 工具函数
│   ├── package.json    # 依赖配置
│   └── .env            # 环境变量
├── src/                # 前端源代码
│   ├── components/     # React组件
│   ├── pages/          # 页面组件
│   └── main.tsx       # 入口文件
├── public/             # 静态资源
├── data/              # 数据持久化目录
├── Dockerfile         # Docker构建文件
├── docker-compose.yml  # Docker Compose配置
├── .github/workflows/  # GitHub Actions配置
│   └── docker-build.yml
├── .dockerignore      # Docker忽略文件
└── scripts/           # 部署脚本
    ├── deploy.sh      # Linux/Mac部署脚本
    └── deploy.bat     # Windows部署脚本
```

## 🤝 贡献

欢迎贡献！请遵循以下步骤：

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📝 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- React团队提供优秀的框架
- Vite团队提供快速的构建工具
- Tailwind CSS团队提供实用的CSS框架
- Docker团队提供容器化解决方案

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交Issue
- 发送Pull Request
- 联系项目维护者

---

**注意**: 这是一个示例项目，用于学习和演示目的。在生产环境中使用时，请务必：
- 修改默认密码
- 配置HTTPS
- 设置备份策略
- 实施安全加固措施
