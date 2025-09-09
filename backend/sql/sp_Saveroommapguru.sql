CREATE OR ALTER PROCEDURE sp_Saveroommapguru
    @HotelId INT,
    @Rooms dbo.RoomMapGuruType READONLY
AS
BEGIN
    SET NOCOUNT ON;

    -- MERGE para insertar o actualizar según corresponda
    MERGE RoomMapGuru AS target
    USING (
        SELECT 
            @HotelId AS HotelId,
            IdRoom,
            [name],
            [type],
            uri,
            [map],
            orden
        FROM @Rooms
    ) AS source
    ON target.HotelId = source.HotelId AND target.IdRoom = source.IdRoom

    WHEN MATCHED THEN
        UPDATE SET 
            [name] = source.[name],
            [type] = source.[type],
            uri = source.uri,
            [map] = source.[map],
            orden = source.orden

    WHEN NOT MATCHED THEN
        INSERT (HotelId, IdRoom, [name], [type], uri, [map], orden)
        VALUES (source.HotelId, source.IdRoom, source.[name], source.[type], source.uri, source.[map], source.orden);

END
GO
