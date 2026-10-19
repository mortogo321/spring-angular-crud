# syntax=docker/dockerfile:1.7

# Stage 1: build the Angular production bundle with bun.
# bun is the package manager/script runner, but the Angular CLI checks
# process.version and rejects bun's emulated Node version (too low for the
# CLI's minimum), so `ng build` itself must run on real Node. node:26-alpine
# + the bun binary copied in gives us both (bun's source image must also be
# the -alpine/musl variant to match node:26-alpine's libc).
FROM node:26.12-alpine AS build
COPY --from=oven/bun:1.4.2-alpine /usr/local/bin/bun /usr/local/bin/bun

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Stage 2: serve the static bundle with nginx.
FROM nginx:1.29-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# nginx's unprivileged uid is 101; match it rather than running as root.
RUN chown -R 101:101 /usr/share/nginx/html /var/cache/nginx /var/log/nginx \
  && touch /var/run/nginx.pid && chown 101:101 /var/run/nginx.pid
USER 101:101

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
