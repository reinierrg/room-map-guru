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
    occupancy?: boolean, 
    bed?: number,
    view?: string, 
}

export interface IHotelSearchResult {
    id: string;
    name: string;
}

export interface IHotel {
    id: number,
    name:  string,
    color: string,
    icon: string,
}

export interface IAgent {
    id: RoomType,
    name: string,
    color: string,
    icon: string
}