FROM node:22-bookworm-slim AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# routeRules 在构建阶段读取代理目标。
ARG XENTRY_BACKEND_URL
ENV XENTRY_BACKEND_URL=${XENTRY_BACKEND_URL}

RUN pnpm build


FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output

CMD ["node", ".output/server/index.mjs"]
