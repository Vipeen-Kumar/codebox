FROM node:18-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source
COPY . .

ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
