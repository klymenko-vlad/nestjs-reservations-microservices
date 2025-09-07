FROM node:alpine AS development

WORKDIR /usr/src/app

# Copy root package files
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json nest-cli.json ./

RUN npm install -g pnpm

# Install root dependencies
RUN pnpm install

# Copy reservations app package.json first (for dependency install)
COPY apps/reservations/package.json apps/reservations/package.json
# If reservations has its own lockfile, copy that too
# COPY apps/reservations/pnpm-lock.yaml apps/reservations/pnpm-lock.yaml

RUN cd apps/reservations && pnpm install

# Copy full source code
COPY apps/reservations apps/reservations
COPY libs libs

# Build the reservations service
RUN pnpm run build reservations


FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Copy reservations package.json and install prod deps
COPY --from=development /usr/src/app/apps/reservations/package.json apps/reservations/package.json
RUN cd apps/reservations && pnpm install --prod

# Copy built dist
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/reservations/main"]
