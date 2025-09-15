CREATE OR ALTER PROCEDURE sp_Saveroommapguru
    @roomId1 BIGINT,
    @roomId2 BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    -- Actualizar la columna 'map' de RoomMapGuru
    UPDATE RoomMapGuru
    SET map = @roomId2
    WHERE IdRoom = @roomId1;

END
GO