USE [room-map-guru];
GO

/* ============================================================
   CREAR TABLA: RoomMapGuru
   ============================================================ */
IF NOT EXISTS (
    SELECT * FROM sysobjects 
    WHERE name = 'RoomMapGuru' AND xtype = 'U'
)
BEGIN
    PRINT '>>> Creando tabla RoomMapGuru...';
    CREATE TABLE dbo.RoomMapGuru (
        HotelId INT NOT NULL,
        [type] NVARCHAR(50) NOT NULL,
        IdRoom BIGINT NOT NULL, 
        [name] NVARCHAR(500) NOT NULL,
        uri NVARCHAR(500) NULL,
        [map] INT NOT NULL DEFAULT 0,
        orden INT NOT NULL DEFAULT 0,
        CONSTRAINT PK_RoomMapGuru PRIMARY KEY (HotelId, IdRoom)
    );
END
ELSE
BEGIN
    PRINT '>>> La tabla RoomMapGuru ya existe, no se creará.';
END
GO

/* ============================================================
   PROCEDIMIENTO: sp_RoomMapGuru
   ============================================================ */
IF EXISTS (
    SELECT * FROM sysobjects 
    WHERE name = 'sp_RoomMapGuru' AND xtype = 'P'
)
BEGIN
    PRINT '>>> Eliminando procedimiento sp_RoomMapGuru...';
    DROP PROCEDURE sp_RoomMapGuru;
END
GO

CREATE PROCEDURE sp_RoomMapGuru
    @hotelId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        [type],
        IdRoom,
        [name],
        uri,
        [map],
        orden,
        HotelId
    FROM dbo.RoomMapGuru
    WHERE HotelId = @hotelId
    ORDER BY orden, [name];
END;
GO

/* ============================================================
   PROCEDIMIENTO: sp_Saveroommapguru
   ============================================================ */
IF EXISTS (
    SELECT * FROM sysobjects 
    WHERE name = 'sp_Saveroommapguru' AND xtype = 'P'
)
BEGIN
    PRINT '>>> Eliminando procedimiento sp_Saveroommapguru...';
    DROP PROCEDURE sp_Saveroommapguru;
END
GO

CREATE PROCEDURE sp_Saveroommapguru
    @roomId1 BIGINT,
    @roomId2 BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    -- Actualizar la columna 'map' de RoomMapGuru
    UPDATE dbo.RoomMapGuru
    SET [map] = @roomId2
    WHERE IdRoom = @roomId1;
END;
GO
