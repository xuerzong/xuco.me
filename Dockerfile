FROM node:22-alpine as base

# install dependencies
FROM base as deps
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile


# build the app
FROM base as builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build


FROM nginx:stable as prod
WORKDIR /app
COPY --from=buidler /app/apps/web/out /usr/share/nginx/html
COPY --from=buidler /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]