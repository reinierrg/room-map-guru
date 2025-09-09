-- Tipo de tabla que usarás como parámetro
IF NOT EXISTS (SELECT * FROM sys.types WHERE name = 'RoomMapGuruType')
CREATE TYPE dbo.RoomMapGuruType AS TABLE
(
    IdRoom BIGINT NOT NULL,
    [name] NVARCHAR(500) NOT NULL,
    [type] NVARCHAR(50) NOT NULL,
    uri NVARCHAR(500) NULL,
    [map] INT NOT NULL DEFAULT 0,
    orden INT NOT NULL DEFAULT 0
);
GO