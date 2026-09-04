FROM 1panel/node@sha256:682102f470a19f8dca319e66c9d612a0c4c1b2ab1c39e86f28f46ef913c6e353

RUN apt-get update \
  && apt-get install -y --no-install-recommends libexpat1 libnspr4 libnss3 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY vendor/xlsx-0.20.3.tgz ./vendor/xlsx-0.20.3.tgz
RUN npm ci --omit=dev --ignore-scripts \
  && npm cache clean --force

COPY server.mjs xlsx-sync.mjs schoolwiki-sync.mjs ./

ENV NODE_ENV=production \
  HOME=/tmp \
  CACHE_DIR=/cache

USER 1000:1000

EXPOSE 3456

CMD ["node", "server.mjs"]
