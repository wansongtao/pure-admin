FROM nginx:alpine

# 删除默认的 nginx 静态文件
RUN rm -rf /usr/share/nginx/html/*

# 复制构建后的文件到容器中
COPY dist /usr/share/nginx/html

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# ['docker build -t pure-admin-vue3 .', 'docker run -d -p 80:80 pure-admin-vue3']
CMD ["nginx", "-g", "daemon off;"]