# Etapa 1: Construcción
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Copiar configuración de Docker para el build
# Esto establece NEXT_PUBLIC_API_URL=/api para rutas relativas
COPY .env.docker .env

# Ejecutamos el build (esto generará la carpeta /out)
RUN npm run build

# Etapa 2: Servidor ligero Nginx
FROM nginx:1.25-alpine
# Copiamos la salida estática compilada
COPY --from=builder /app/out /usr/share/nginx/html
# Copiamos la configuración de Nginx con proxy para API
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]