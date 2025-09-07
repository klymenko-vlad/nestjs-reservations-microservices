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

# Copy the payments app and libs
COPY apps/payments apps/payments
COPY libs libs

# Install payments-specific dependencies if package.json exists
RUN if [ -f apps/payments/package.json ]; then cd apps/payments && pnpm install; fi

# Build the payments service
RUN pnpm run build payments

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Copy payments-specific package.json and install if exists
COPY --from=development /usr/src/app/apps/payments/package.json ./apps/payments/package.json 2>/dev/null || true
RUN if [ -f apps/payments/package.json ]; then cd apps/payments && pnpm install --prod; fi

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/payments/main"]