# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /server
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
COPY . .
CMD ["node", "app.js"]
EXPOSE 3000