# Etapa 1: Construcción
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Copiar configuración de Docker para el build
COPY .env.docker .env

# Ejecutamos el build (genera .next)
RUN npm run build

# Etapa 2: Servidor Next.js dinámico
FROM node:20-alpine
WORKDIR /app

# Copiar dependencias necesarias del builder
COPY package*.json ./
RUN npm install --only=production

# Copiar el código compilado
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env .env

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node_modules/.bin/next", "start"]