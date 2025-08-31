# Etapa 1: build con node
FROM node:20 AS build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la app
RUN npm run build

# Etapa 2: servir con nginx
FROM nginx:alpine

# Eliminar la config default
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos generados en la build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración nginx opcional (si necesitas rewrite)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
