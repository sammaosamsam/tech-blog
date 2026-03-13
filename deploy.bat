@echo off
REM 部署脚本 - 推送到GitHub

echo Tech Blog - GitHub Push Script
echo ================================

REM 添加所有文件
echo 添加文件到Git...
git add .

REM 提交更改
echo 提交更改...
git commit -m "Initial commit: Tech Blog with Docker support"

REM 推送到GitHub
echo 推送到GitHub...
git push -u origin main

echo.
echo 推送完成! 请访问 GitHub 仓库查看 Actions 构建状态。
pause
