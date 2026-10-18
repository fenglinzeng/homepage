FROM node:22-bookworm-slim AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --allow-build esbuild

COPY . .

RUN pnpm build


FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/.output ./.output

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.NITRO_PORT || '3000')).then((response) => { if (!response.ok) process.exit(1) }).catch(() => process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
