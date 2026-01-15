FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig* ./
COPY . .

# Clean public/artifacts to ensure fresh build if running locally (optional but good practice)
# RUN rm -rf web/.next

RUN npm install
RUN npx prisma generate --schema=./shared/prisma/schema.prisma
RUN npm run build -w shared
# Set env vars required for build time if necessary (usually Next.js needs them if using internal fetch calls during build)
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://dummy:5432/dummy"
RUN npm run build -w web

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy next.js standalone output
# The standalone build puts dependencies in .next/standalone/node_modules
# It also creates a server.js entrypoint

# We need to copy the standalone folder
COPY --from=builder /app/web/.next/standalone ./
COPY --from=builder /app/web/.next/static ./web/.next/static
COPY --from=builder /app/web/public ./web/public

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "web/server.js"]
