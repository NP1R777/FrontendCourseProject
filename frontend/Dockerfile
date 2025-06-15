# frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY frontend/package*.json .
# Добавляем флаг для игнорирования конфликтов зависимостей
RUN npm install --legacy-peer-deps

COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
# COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000