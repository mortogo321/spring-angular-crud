# syntax=docker/dockerfile:1

# Stage 1: build the Angular production bundle with bun.
# bun is the package manager/script runner, but the Angular CLI checks
# process.version and rejects bun's emulated Node version (too low for the
# CLI's minimum), so `ng build` itself must run on real Node. node:26-alpine
# + the bun binary copied in gives us both (bun's source image must also be
# the -alpine/musl variant to match node:26-alpine's libc).
FROM node:26-alpine AS build
COPY --from=oven/bun:1-alpine /usr/local/bin/bun /usr/local/bin/bun

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Stage 2: serve the static bundle with nginx.
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
