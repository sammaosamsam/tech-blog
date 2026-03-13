# 项目结构详解

## 目录树

```
tech-blog/
├── .github/                       # GitHub配置
│   └── workflows/                  # GitHub Actions工作流
│       └── docker-build.yml        # Docker镜像构建工作流
│
├── backend/                       # 后端代码
│   ├── src/                      # 源代码目录
│   │   ├── routes/               # 路由定义
│   │   │   └── auth.js          # 认证路由和中间件
│   │   └── utils/                # 工具函数
│   │       └── fileStorage.js   # 文件存储工具
│   ├── index.js                  # 主入口文件
│   ├── package.json             # 后端依赖配置
│   ├── package-lock.json        # 依赖锁定文件
│   └── .env                    # 环境变量配置
│
├── data/                         # 数据持久化目录
│   └── .gitkeep                # 保持目录结构
│
├── public/                       # 前端静态资源
│   └── vite.svg                # Vite图标
│
├── scripts/                      # 部署和工具脚本
│   ├── deploy.sh               # Linux/Mac部署脚本
│   └── deploy.bat              # Windows部署脚本
│
├── src/                          # 前端源代码
│   ├── components/             # React组件
│   │   ├── ArticleCard.tsx     # 文章卡片组件
│   │   ├── ArticleEditor.tsx   # 文章编辑器
│   │   ├── ArticleListManager.tsx  # 文章列表管理
│   │   ├── MarkdownRenderer.tsx    # Markdown渲染器
│   │   └── ProtectedRoute.tsx    # 路由保护
│   ├── pages/                  # 页面组件
│   │   ├── Admin.tsx          # 后台管理页
│   │   ├── ArticleDetail.tsx  # 文章详情页
│   │   ├── Home.tsx           # 首页
│   │   ├── Login.tsx          # 登录页
│   │   └── Tags.tsx           # 标签页
│   ├── main.tsx              # 应用入口
│   └── vite-env.d.ts         # Vite类型声明
│
├── .dockerignore              # Docker构建忽略文件
├── .gitignore                # Git忽略文件
├── CHECKLIST.md             # 部署检查清单
├── DEPLOYMENT.md            # Docker部署文档
├── DOCKER.md               # GitHub+Docker文档
├── Dockerfile              # Docker镜像构建文件
├── docker-compose.yml      # Docker Compose配置
├── eslint.config.js        # ESLint配置
├── index.html             # HTML入口
├── LICENSE                # MIT许可证
├── package.json           # 前端依赖配置
├── package-lock.json      # 前端依赖锁定文件
├── postcss.config.js      # PostCSS配置
├── PROJECT_STRUCTURE.md   # 项目结构文档（本文件）
├── QUICKSTART.md          # 快速开始指南
├── README.md             # 项目说明文档
├── tailwind.config.js     # Tailwind CSS配置
├── tsconfig.app.json      # 应用TypeScript配置
├── tsconfig.json          # TypeScript配置
├── tsconfig.node.json     # Node.js TypeScript配置
└── vite.config.ts         # Vite配置
```

## 核心文件说明

### Docker相关

#### Dockerfile
多阶段构建配置文件，负责：
- 前端构建阶段：使用Node.js Alpine镜像构建React应用
- 后端构建阶段：安装后端依赖
- 运行阶段：合并前后端，使用PM2运行

#### docker-compose.yml
Docker编排配置文件，定义：
- 服务配置
- 端口映射
- 卷挂载
- 健康检查
- 网络配置

#### .dockerignore
优化Docker构建，排除不必要的文件

### GitHub Actions

#### .github/workflows/docker-build.yml
自动化CI/CD工作流，实现：
- 多平台构建（amd64, arm64）
- 自动推送到GitHub Container Registry
- 缓存优化
- 构建触发（push, PR）

### 前端核心

#### vite.config.ts
Vite构建配置：
- 插件配置（React）
- 代理设置（/api到后端）
- 构建优化（代码分割、压缩）
- 基础路径配置

#### package.json
前端依赖管理：
- React 19.2.4
- React Router DOM 7.13.1
- React Markdown 10.1.0
- TypeScript 5.9.3
- Tailwind CSS 3.4.0
- Vite 8.0.0

### 后端核心

#### index.js
Express服务器主文件：
- 中间件配置（CORS, JSON解析）
- 静态文件服务
- API路由（文章、认证）
- 健康检查
- 错误处理

#### src/routes/auth.js
认证相关：
- 用户数据库（模拟）
- 登录路由
- Token中间件

#### src/utils/fileStorage.js
文件存储工具：
- 读取文章
- 保存文章
- 生成ID

### 前端组件

#### ArticleCard.tsx
文章卡片展示：
- 标题、摘要、标签
- 作者、日期、阅读时间
- 点击跳转详情

#### ArticleEditor.tsx
文章编辑器：
- 表单输入（标题、摘要、内容）
- Markdown编辑
- 保存/取消操作

#### ArticleListManager.tsx
文章列表管理：
- 文章列表展示
- 搜索过滤
- 编辑/删除操作

#### MarkdownRenderer.tsx
Markdown渲染：
- react-markdown渲染
- 代码高亮（rehype-highlight）
- GFM支持（remark-gfm）

#### ProtectedRoute.tsx
路由保护：
- Token验证
- 未登录重定向
- 子组件渲染

### 前端页面

#### Home.tsx
首页：
- 文章列表展示
- 数据加载状态
- 错误处理

#### ArticleDetail.tsx
文章详情页：
- 文章内容渲染
- 标签展示
- 返回导航

#### Login.tsx
登录页：
- 用户名/密码输入
- 表单验证
- 错误提示
- Token存储

#### Admin.tsx
后台管理页：
- 文章管理（CRUD）
- 退出登录
- 标签页切换

#### Tags.tsx
标签页：
- 标签云展示
- 标签筛选
- 文章列表过滤

## 数据流

### 文章数据流

```
用户操作 → 前端组件 → API请求 → 后端路由 → 业务逻辑 → 文件存储 → 数据持久化
```

### 认证流程

```
用户登录 → 前端表单 → API请求 → 验证 → 生成Token → 存储到localStorage → 后续请求携带Token
```

### 构建流程

```
源代码 → Docker构建 → 前端构建 → 后端构建 → 镜像打包 → 推送到Registry → 部署运行
```

## 配置文件详解

### 环境变量

#### backend/.env
```env
NODE_ENV=production
PORT=5000
```

### 构建配置

#### tsconfig.json
TypeScript编译配置：
- 目标ES2020
- 模块系统ESNext
- 严格模式
- 路径别名

#### tailwind.config.js
Tailwind CSS配置：
- 主题扩展
- 插件配置
- 自定义样式

## 部署文件

### 脚本文件

#### scripts/deploy.sh
Linux/Mac部署脚本：
- Git初始化
- 添加文件
- 提交和推送
- 错误处理

#### scripts/deploy.bat
Windows部署脚本：
- Git初始化
- 添加文件
- 提交和推送
- 用户提示

### 文档文件

- README.md - 项目总览
- QUICKSTART.md - 快速开始
- DEPLOYMENT.md - 部署指南
- DOCKER.md - Docker和GitHub集成
- CHECKLIST.md - 检查清单
- PROJECT_STRUCTURE.md - 项目结构（本文件）

## 关键技术点

### 前端技术

- **组件化**: React函数组件
- **路由**: React Router DOM v7
- **状态管理**: React Hooks
- **样式**: Tailwind CSS工具类
- **Markdown**: react-markdown + 插件
- **类型安全**: TypeScript

### 后端技术

- **框架**: Express.js
- **中间件**: CORS, body-parser
- **存储**: 文件系统
- **认证**: Base64 Token
- **静态文件**: express.static

### 部署技术

- **容器化**: Docker多阶段构建
- **编排**: Docker Compose
- **CI/CD**: GitHub Actions
- **镜像仓库**: GitHub Container Registry
- **进程管理**: PM2

## 扩展建议

### 功能扩展

- [ ] 用户注册
- [ ] 评论系统
- [ ] 文章点赞
- [ ] 搜索功能
- [ ] 图片上传
- [ ] RSS订阅

### 技术升级

- [ ] 迁移到数据库（MongoDB/PostgreSQL）
- [ ] 使用JWT替代Base64 Token
- [ ] 添加单元测试
- [ ] 实施E2E测试
- [ ] 性能监控

### 部署优化

- [ ] 配置Nginx反向代理
- [ ] 启用HTTPS
- [ ] CDN加速
- [ ] 负载均衡
- [ ] 自动化备份

## 维护指南

### 日常维护

1. **依赖更新**: 定期运行 `npm update`
2. **安全检查**: 运行 `npm audit`
3. **日志监控**: 检查容器日志
4. **数据备份**: 备份data目录

### 故障排查

1. **容器问题**: 查看 `docker logs`
2. **构建问题**: 检查GitHub Actions日志
3. **API问题**: 查看后端日志
4. **前端问题**: 查看浏览器控制台

---

本文档提供了完整的项目结构说明，有助于理解项目的组织方式和各个文件的作用。
