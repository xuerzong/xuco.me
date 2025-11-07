FROM node:22-alpine as base

# install dependencies
FROM base as builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build



FROM nginx:stable as prod
WORKDIR /app
COPY --from=builder /app/apps/web/out /usr/share/nginx/html
COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]