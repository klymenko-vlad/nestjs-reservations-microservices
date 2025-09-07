FROM node:alpine AS development

WORKDIR /usr/src/app

# Copy root package files
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json nest-cli.json ./

RUN npm install -g pnpm

# Install root dependencies
RUN pnpm install

# Copy auth app package.json first (for dependency install)
COPY apps/auth/package.json apps/auth/package.json
# If auth has its own lockfile, copy that too
# COPY apps/auth/pnpm-lock.yaml apps/auth/pnpm-lock.yaml

RUN cd apps/auth && pnpm install

# Copy full source code
COPY apps/auth apps/auth
COPY libs libs

# Build the auth service
RUN pnpm run build auth


FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Copy auth package.json and install prod deps
COPY --from=development /usr/src/app/apps/auth/package.json apps/auth/package.json
RUN cd apps/auth && pnpm install --prod

# Copy built dist
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]
