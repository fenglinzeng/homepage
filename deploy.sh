#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "拉取 origin/main 最新代码..."
git pull --ff-only origin main

if [[ ! -f .env ]]; then
  echo "缺少 .env，请先复制 .env.example 并填写生产配置。" >&2
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE=(docker-compose)
else
  echo "未找到 Docker Compose，请安装 docker compose 插件或 docker-compose。" >&2
  exit 1
fi

"${COMPOSE[@]}" config -q
"${COMPOSE[@]}" up -d --build

for _ in {1..30}; do
  health_status="$(docker inspect --format '{{.State.Health.Status}}' homepage 2>/dev/null || true)"

  if [[ "$health_status" == "healthy" ]]; then
    "${COMPOSE[@]}" ps
    exit 0
  fi

  if [[ "$health_status" == "unhealthy" ]]; then
    "${COMPOSE[@]}" logs --tail=80 homepage >&2 || true
    echo "homepage 健康检查失败。" >&2
    exit 1
  fi

  sleep 2
done

"${COMPOSE[@]}" ps
"${COMPOSE[@]}" logs --tail=80 homepage >&2 || true
echo "等待 homepage 健康检查超时。" >&2
exit 1
