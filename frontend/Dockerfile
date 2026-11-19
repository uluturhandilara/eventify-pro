# syntax=docker/dockerfile:1

# ---------- 1. Aşama: Derleme (Node) ----------
FROM node:22-alpine AS build
WORKDIR /app

# Önce yalnızca bağımlılık dosyaları: package.json değişmedikçe npm ci katmanı cache'ten gelir
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# tsc -b && vite build → statik dosyalar dist/ altına çıkar
RUN npm run build

# ---------- 2. Aşama: Sunma (Nginx) ----------
FROM nginx:1.27-alpine
# Nginx: statik dosyaları verir, /api/ isteklerini backend container'ına iletir (bkz. nginx.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
