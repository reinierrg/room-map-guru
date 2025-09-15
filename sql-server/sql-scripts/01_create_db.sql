-- 01_create_db.sql

IF NOT EXISTS (
    SELECT name
    FROM sys.databases
    WHERE name = N'room-map-guru'
)
BEGIN
    PRINT '>>> Creando base de datos room-map-guru...';
    CREATE DATABASE [room-map-guru];
END
ELSE
BEGIN
    PRINT '>>> La base de datos room-map-guru ya existe. Saltando creación.';
END
GO