# Ejecutar en el docker el servidor sql server
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Admin!Sql123" -p 1433:1433 --name sqlserverdb -d mcr.microsoft.com/mssql/server:2022-latest


# Probar conexion en docker desde el contenedor
docker exec -it backend sh

# verificar las variables de entorno definidas
echo $DB_HOST
echo $DB_USER
echo $DB_PASS
echo $DB_NAME

# prueba conectarte desde el contendor

apk add --no-cache curl
nc -zv db 1433