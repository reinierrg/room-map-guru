// Tipos para habitaciones
export type RoomType = 'Interno' | 'Expedia' | 'HB' | 'HS';

export interface IRoom {
    id: number
    description?: string
    position: string
    name: string;
    type: RoomType;
    uri?: string; 
    mapExpedia?: number[];
    mapHb?: number[];
    mapHs?: number[];
    map?: string;
    price?: number;
}

export interface IRoomMapping {
    sourceId: string;
    targetId: string;
    provider: RoomType;
    similarity?: number;
}

export interface IHotelSearchResult {
    id: number;
    name: string;
    location: string;
    rating?: number;
    thumbnail?: string;
}

export interface IHotel {
    id: number,
    name:  string,
    color: string,
    icon: string,
}

export interface AutoMapRequest {
    hotelId: string;
    similarityThreshold: number;
}

export type IdAgent = 'Interno' | 'Expedia' | 'HB' | 'HS'

export interface IAgent {
    id: IdAgent,
    name: string,
    color: string,
    icon: string
}