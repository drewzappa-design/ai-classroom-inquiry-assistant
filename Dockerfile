FROM node:20-alpine AS backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/index.js ./
COPY server/README.md ./
EXPOSE 3001
CMD ["npm", "start"]

FROM python:3.12-alpine AS frontend
WORKDIR /app
COPY . .
EXPOSE 8000
CMD ["python", "-m", "http.server", "8000"]
