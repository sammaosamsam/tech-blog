# GitHub部署检查清单

## 推送前检查

- [ ] 所有Docker相关文件已创建
  - [x] Dockerfile
  - [x] docker-compose.yml
  - [x] .dockerignore

- [ ] GitHub Actions配置已创建
  - [x] .github/workflows/docker-build.yml

- [ ] 文档已完善
  - [x] README.md
  - [x] QUICKSTART.md
  - [x] DEPLOYMENT.md
  - [x] DOCKER.md
  - [x] CHECKLIST.md
  - [x] LICENSE

- [ ] 部署脚本已创建
  - [x] scripts/deploy.sh (Linux/Mac)
  - [x] scripts/deploy.bat (Windows)

- [ ] 项目配置已更新
  - [x] Vite配置优化
  - [x] 后端添加静态文件服务
  - [x] .gitignore更新
  - [x] 数据目录结构

## 代码质量检查

- [ ] 前端代码
  - [x] API URL改为相对路径
  - [x] 数据结构统一（_id字段）
  - [x] 类型定义正确
  - [x] 无明显的错误或警告

- [ ] 后端代码
  - [x] 静态文件服务配置
  - [x] 健康检查端点
  - [x] CORS配置
  - [x] 错误处理

## GitHub配置检查

- [ ] 仓库设置
  - [ ] GitHub Actions权限已启用
  - [ ] Packages权限已启用
  - [ ] Container Registry已启用
  - [ ] 默认分支设置为main

- [ ] 个人访问令牌（PAT）
  - [ ] 创建了PAT
  - [ ] PAT具有以下权限：
    - [ ] repo (仓库访问)
    - [ ] write:packages (写入packages)
    - [ ] read:packages (读取packages)
    - [ ] delete:packages (删除packages)

## 推送步骤

### 1. 初始化Git仓库

```bash
cd tech-blog
git init
```

### 2. 配置远程仓库

```bash
# 使用HTTPS
git remote add origin https://github.com/<your-username>/<repo-name>.git

# 或使用SSH
git remote add origin git@github.com:<your-username>/<repo-name>.git
```

### 3. 添加并提交

```bash
git add .
git commit -m "Add Docker support and complete deployment configuration"
```

### 4. 推送到GitHub

```bash
git branch -M main
git push -u origin main
```

## 推送后检查

### 5. 验证仓库内容

- [ ] 访问GitHub仓库
- [ ] 确认所有文件都已上传
- [ ] 检查README.md显示正常

### 6. 查看GitHub Actions

- [ ] 访问Actions标签
- [ ] 查看"Build and Push Docker Image"工作流
- [ ] 确认构建正在运行

### 7. 监控构建过程

- [ ] 观察构建日志
- [ ] 确认所有步骤成功
- [ ] 检查镜像是否推送成功

### 8. 验证Container Registry

- [ ] 访问仓库的Packages页面
- [ ] 确认Docker镜像存在
- [ ] 检查镜像标签（latest, main等）

### 9. 测试拉取镜像

```bash
# 登录GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u <your-username> --password-stdin

# 拉取镜像
docker pull ghcr.io/<your-username>/<repo-name>/tech-blog:latest
```

### 10. 测试运行镜像

```bash
docker run -d \
  --name tech-blog-test \
  -p 5000:5000 \
  -v $(pwd)/data:/app/backend/data \
  ghcr.io/<your-username>/<repo-name>/tech-blog:latest

# 测试访问
curl http://localhost:5000/health
open http://localhost:5000
```

## 部署后检查

### 功能测试

- [ ] 前端页面加载正常
- [ ] 文章列表显示
- [ ] 文章详情页打开
- [ ] 登录功能正常
- [ ] 后台管理可访问
- [ ] 创建文章功能
- [ ] 编辑文章功能
- [ ] 删除文章功能

### 性能测试

- [ ] 页面加载速度
- [ ] API响应时间
- [ ] 静态资源加载

### 安全检查

- [ ] 修改了默认密码
- [ ] 启用了HTTPS（生产环境）
- [ ] 配置了防火墙规则
- [ ] 实施了备份策略

## 故障排查

### 构建失败

1. 检查GitHub Actions日志
2. 验证Dockerfile语法
3. 确认依赖文件完整
4. 检查权限设置

### 推送失败

1. 验证远程仓库URL
2. 检查GitHub凭据
3. 确认仓库权限

### 拉取失败

1. 确认已登录GitHub Container Registry
2. 检查镜像名称和标签
3. 验证网络连接

### 运行失败

1. 查看容器日志
2. 检查端口占用
3. 验证卷挂载
4. 检查环境变量

## 维护任务

### 定期维护

- [ ] 更新依赖包
- [ ] 更新基础镜像
- [ ] 备份数据
- [ ] 监控日志
- [ ] 检查安全漏洞

### 版本发布

- [ ] 更新版本号
- [ ] 创建Release
- [ ] 打Tag
- [ ] 构建镜像
- [ ] 更新文档

## 联系方式

如有问题，请：
1. 查看GitHub Issues
2. 检查Actions日志
3. 查看容器日志
4. 参考项目文档

---

**重要提示**:

- 首次推送前请确保已配置GitHub PAT
- 首次部署后请立即修改默认密码
- 生产环境务必配置HTTPS
- 定期备份data目录
