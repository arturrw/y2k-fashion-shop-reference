# ---- deps ----
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund

# ---- dev: hot-reload dev server (source bind-mounted by docker-compose) ----
FROM base AS dev
ENV HOST=0.0.0.0
EXPOSE 4321
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---- build ----
FROM base AS build
COPY . .
RUN npm run build

# ---- tools: one-shot schema push + seed (needs dev deps) ----
FROM build AS tools
CMD ["sh", "-c", "npx drizzle-kit push --force && npx tsx scripts/seed.ts"]

# ---- runtime ----
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4321
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY --from=build /app/dist ./dist
USER node
EXPOSE 4321
CMD ["node", "dist/server/entry.mjs"]
