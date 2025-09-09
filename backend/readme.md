# Ejecutar en el docker el servidor sql server
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Admin&Sql" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest