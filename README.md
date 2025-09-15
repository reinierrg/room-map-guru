# Configuración del Proyecto
## Frontend
## Variables de Entorno
## El proyecto utiliza diferentes configuraciones para desarrollo y producción:

## Entorno de Desarrollo (.env.development)
```bash
VITE_API_BASE_URL=http://localhost:4000
VITE_API_HOTEL_SEARCH=https://v97cnb0e48gkz1iyp.a1.typesense.net/multi_search
VITE_API_HOTEL_SEARCH_TOKEN=
VITE_NODE_ENV=development
```

## Entorno de Producción para Docker (.env.production)
```bash
VITE_API_BASE_URL=/api
VITE_API_HOTEL_SEARCH=https://v97cnb0e48gkz1iyp.a1.typesense.net/multi_search
VITE_API_HOTEL_SEARCH_TOKEN=
VITE_NODE_ENV=production
```
## Backend
## Configuración del Servidor
```bash
# Puerto del servidor
PORT=4000

# Configuración SQL Server
DB_USER=sa
DB_PASS=Admin!Sql123
DB_HOST=localhost
DB_NAME=room-map-guru
DB_PORT=1433
```
# Ejecución en Desarrollo
## Para ejecutar el proyecto en modo desarrollo:

# Navegar a las carpetas /frontend y /backend

# Ejecutar el comando npm run dev en cada una

# Configuración de Base de Datos
## Iniciar SQL Server en Docker
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Admin!Sql123" \
  -p 1433:1433 --name sqlserverdb -d \
  mcr.microsoft.com/mssql/server:2022-latest
```

# Gestión de la Base de Datos
## Utilizar Azure Data Studio o similar para administrar la base de datos
## Las credenciales deben coincidir con las definidas en el archivo .env del backend
## Los scripts de inicialización se encuentran en /sql-server/sql-scripts/:
### Scripts individuales para creación de BD, tablas y stored procedures
### Script completo init.sql para configuración completa
### Datos básicos para inicializar la aplicación

# Docker Compose
## Construir y ejecutar contenedores
```bash
docker-compose up --build
```
## Detener y eliminar contenedores
```bash
docker-compose down
```
### Nota: Después de iniciar los contenedores, es necesario configurar la base de datos ejecutando los scripts SQL mencionados anteriormente.