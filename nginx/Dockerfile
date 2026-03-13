FROM nginx:1.25-alpine

# 移除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义配置
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d/tech-blog.conf /etc/nginx/conf.d/tech-blog.conf

EXPOSE 80 443
