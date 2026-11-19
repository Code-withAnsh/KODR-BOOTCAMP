FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src

ENV NODE_ENV=production
EXPOSE 8080

# Larger young generation = fewer GC pauses; more heap headroom for the in-memory store
CMD ["node", "--max-semi-space-size=64", "--max-old-space-size=4096", "src/server.js"]
