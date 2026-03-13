# 多阶段构建 - 前端构建阶段
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# 复制前端依赖文件
COPY package*.json ./
COPY package-lock.json ./

# 安装前端依赖
RUN npm ci

# 复制前端源代码
COPY . .

# 构建前端
RUN npm run build

# 后端构建阶段
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# 复制后端依赖文件
COPY backend/package*.json ./
COPY backend/package-lock.json ./

# 安装后端依赖
RUN npm ci --only=production

# 复制后端源代码
COPY backend ./

# 复制环境配置
COPY backend/.env ./

# 最终运行阶段
FROM node:20-alpine

WORKDIR /app

# 安装PM2用于进程管理
RUN npm install -g pm2

# 从后端构建阶段复制
COPY --from=backend-builder /app/backend /app/backend
COPY --from=backend-builder /app/backend/node_modules /app/backend/node_modules

# 从前端构建阶段复制构建产物
COPY --from=frontend-builder /app/frontend/dist /app/backend/public

# 创建数据目录
RUN mkdir -p /app/backend/data

# 暴露端口
EXPOSE 5000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 使用PM2运行后端，并设置前端为静态文件服务
CMD ["pm2-runtime", "start", "/app/backend/index.js", "--name", "tech-blog"]
