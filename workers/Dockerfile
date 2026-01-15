FROM node:20-alpine AS builder

WORKDIR /app

# Copy root files
COPY package*.json ./
COPY tsconfig* ./

# Copy all workspaces
COPY . .

# Install and build
RUN npm install
RUN npm run build -w shared
RUN npm run build -w workers

# Production runner
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/workers ./workers

ENV NODE_ENV=production

CMD ["npm", "start", "-w", "workers"]
