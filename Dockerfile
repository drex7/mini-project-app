# **************************************

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# # Inject .env at build time (needed for Prisma)
# ARG DATABASE_URL
# ENV DATABASE_URL=$DATABASE_URL

COPY package.json yarn.lock ./
RUN yarn cache clean && yarn install

COPY . .
ENV PORT=3000
ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}

# Build application for production
RUN --mount=type=secret,id=aws_region,env=AWS_REGION \
		yarn build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Use modules from builder to avoid reinstall
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/.nuxt ./.nuxt
COPY --from=builder /app/package.json ./


EXPOSE ${PORT}

CMD ["yarn", "start"]
