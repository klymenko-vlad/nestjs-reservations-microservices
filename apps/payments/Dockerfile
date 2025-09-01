# ---------- Development ----------
FROM node:22 AS development

WORKDIR /usr/src/app

# Copy root package files
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm @nestjs/cli
RUN pnpm install

# Copy the whole repo (for libs & tsconfig, but overridden by volume in dev)
COPY . .

# Build once (for typechecking etc.)
RUN pnpm run build

# ---------- Production ----------
FROM node:22 AS production

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/payments/main"]
