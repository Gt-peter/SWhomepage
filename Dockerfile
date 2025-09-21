# 213703/frontend/Dockerfile (옵션: 단독 빌드/런용, compose에서는 image 사용 중)
FROM node:20-bookworm
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm i
COPY . .
EXPOSE 5173
CMD ["pnpm","run","dev","--","--host","--port","5173"]
