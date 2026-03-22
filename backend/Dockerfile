FROM node:18-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source
COPY . .

ENV NODE_ENV=development
ENV PORT=5000
EXPOSE 5000

CMD ["npm", "start"]
