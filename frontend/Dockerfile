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

# Limpiar default
RUN rm -rf /usr/share/nginx/html/*

# Copiar build al nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Variables de build (pueden venir del docker-compose también)
ENV VITE_API_BASE_URL=/api
ENV VITE_API_HOTEL_SEARCH=https://v97cnb0e48gkz1iyp.a1.typesense.net/multi_search
ENV VITE_API_HOTEL_SEARCH_TOKEN=zyLBfgJbUWYjeevMiscpqeHEQ8lb6qJV

# Copiar config custom de nginx (para proxy hacia backend)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
