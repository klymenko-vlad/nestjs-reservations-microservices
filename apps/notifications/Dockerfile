FROM node:alpine AS development

WORKDIR /usr/src/app

# Copy root package files
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm

# Install root dependencies
RUN pnpm install

# Copy the notifications app and libs
COPY apps/notifications apps/notifications
COPY libs libs

# Install notifications-specific dependencies if package.json exists
RUN if [ -f apps/notifications/package.json ]; then cd apps/notifications && pnpm install; fi

# Build the notifications service
RUN pnpm run build notifications

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Copy notifications-specific package.json and install if exists
COPY --from=development /usr/src/app/apps/notifications/package.json ./apps/notifications/package.json 2>/dev/null || true
RUN if [ -f apps/notifications/package.json ]; then cd apps/notifications && pnpm install --prod; fi

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/notifications/main"]