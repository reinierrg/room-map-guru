import type { IHotelSearchResult, IRoom, RoomType } from "./room.types";

// Define the expected shape of the API room object
interface IApiRoom {
    idroom: string;
    name: string;
    type: string;
    uri: string;
    mapExpedia: string;
    maphb: string;
    maphs: string;
    map: string;
    price: number;
}

// Mapea los datos de la API a nuestro modelo interno
export const mapApiRoomToRoom = (apiRoom: IApiRoom): Partial<IRoom> => ({
    id: apiRoom.idroom,
    name: apiRoom.name,
    type: mapRoomType(apiRoom.type),
    uri: apiRoom.uri,
    mapExpedia: apiRoom.mapExpedia,
    mapHb: apiRoom.maphb,
    mapHs: apiRoom.maphs,
    map: apiRoom.map,
    price: apiRoom.price,
    
});

// Convierte el tipo de habitación de string a nuestro tipo enum
const mapRoomType = (type: string): RoomType => {
    switch (type) {
        case 'Interno': return 'Interno';
        case 'Expedia': return 'Expedia';
        case 'HB': return 'HB';
        case 'HS': return 'HS';
        default: return 'Interno';
    }
};

// Define the expected shape of the API hotel object
interface IApiHotel {
    id: string;
    name: string;
    location: string;
    rating: number;
    thumbnail: string;
}

// Mapea la respuesta de búsqueda de hoteles
export const mapApiHotelToSearchResult = (apiHotel: IApiHotel): IHotelSearchResult => ({
    id: apiHotel.id,
    name: apiHotel.name,
    location: apiHotel.location,
    rating: apiHotel.rating,
    thumbnail: apiHotel.thumbnail
});