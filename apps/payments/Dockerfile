FROM node:alpine AS development

WORKDIR /usr/src/app

# Copy root package files
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json nest-cli.json ./

RUN npm install -g pnpm

# Install root dependencies
RUN pnpm install

# Copy payments app package.json first (for dependency install)
COPY apps/payments/package.json apps/payments/package.json
# If payments has its own lockfile, copy that too
# COPY apps/payments/pnpm-lock.yaml apps/payments/pnpm-lock.yaml

RUN cd apps/payments && pnpm install

# Copy full source code
COPY apps/payments apps/payments
COPY libs libs

# Build the payments service
RUN pnpm run build payments


FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Copy payments package.json and install prod deps
COPY --from=development /usr/src/app/apps/payments/package.json apps/payments/package.json
RUN cd apps/payments && pnpm install --prod

# Copy built dist
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/payments/main"]
