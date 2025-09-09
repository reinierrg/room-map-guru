IF EXISTS (SELECT * FROM sysobjects WHERE name='sp_RoomMapGuru' AND xtype='P')
    DROP PROCEDURE sp_RoomMapGuru;
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