# Etapa base
FROM node:18-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Etapa build (solo producción)
FROM base AS build
COPY . .
RUN npm run build

# Etapa desarrollo
FROM base AS dev
COPY . .
CMD ["npm", "run", "dev"]

# Etapa producción
FROM node:18-alpine AS prod
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev
CMD ["npm", "run", "start"]