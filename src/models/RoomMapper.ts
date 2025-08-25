import type { IRoom } from '../services/room/room.types'

export default class RoomMapper {
    /**
     * Procesa un campo de mapeo de room
     * @param {string|number|Array} fieldValue - Valor del campo a procesar
     * @returns {number[]} Arreglo de números
     */
    static processMappingField(fieldValue: string) {
        if (fieldValue === null || fieldValue === undefined) {
            return []
        }

        if (Array.isArray(fieldValue)) {
            return fieldValue.filter(
                (item) => typeof item === 'number' && !isNaN(item)
            )
        }

        const stringValue =
            typeof fieldValue === 'string' ? fieldValue : String(fieldValue)

        if (stringValue.trim() === '') {
            return []
        }

        return stringValue
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item !== '')
            .map((item) => {
                const num = Number(item)
                return isNaN(num) ? null : num
            })
            .filter((item) => item !== null)
    }

    /**
     * Procesa todos los campos de mapeo de un room
     * @param {Object} room - Objeto room
     * @returns {Object} Room con campos de mapeo procesados
     */
    static processRoom(room: any) {
        if (typeof room !== 'object' || room === null) {
            return room
        }

        return {
            ...room,
            mapExpedia: this.processMappingField(room.mapExpedia),
            mapHb: this.processMappingField(room.mapHb),
            mapHs: this.processMappingField(room.mapHs),
        }
    }

    /**
     * Procesa un arreglo de rooms
     * @param {Array} rooms - Arreglo de objetos room
     * @returns {Array} Arreglo de rooms procesados
     */
    static processRooms(rooms: any) {
        if (!Array.isArray(rooms)) {
            console.error('El parámetro rooms debe ser un arreglo')
            return []
        }

        return rooms.map((room) => this.processRoom(room))
    }

    /**
     * Función para mapear las relaciones a los formatos específicos de cada tipo de room
     */
   static mapRelationsToRoomTypes(
    relations: { [key: number]: number[] },
    allRooms: IRoom[]
): IRoom[] {
    // Crear un mapa de rooms por ID para acceso rápido
    const roomsById = new Map<number, IRoom>();
    allRooms.forEach((room) => {
        if (room.id) {
            roomsById.set(room.id, room);
        }
    });

    // Inicializar arrays para cada tipo de mapeo
    const expediaMappings: Map<number, number[]> = new Map(); // roomId -> mappingIds
    const hbMappings: Map<number, number[]> = new Map();
    const hsMappings: Map<number, number[]> = new Map();

    // Procesar cada relación para agrupar por tipo de room destino
    Object.entries(relations).forEach(([sourceRoomIdStr, targetRoomIds]) => {
        const sourceRoomId = parseInt(sourceRoomIdStr);
        const sourceRoom = roomsById.get(sourceRoomId);
        
        if (!sourceRoom) return;

        targetRoomIds.forEach(targetRoomId => {
            const targetRoom = roomsById.get(targetRoomId);
            if (!targetRoom) return;

            // Determinar a qué mapping agregar según el tipo del room TARGET
            if (targetRoom.type === 'Expedia') {
                if (!expediaMappings.has(sourceRoomId)) {
                    expediaMappings.set(sourceRoomId, []);
                }
                expediaMappings.get(sourceRoomId)!.push(targetRoomId);
            } 
            else if (targetRoom.type === 'HB') {
                if (!hbMappings.has(sourceRoomId)) {
                    hbMappings.set(sourceRoomId, []);
                }
                hbMappings.get(sourceRoomId)!.push(targetRoomId);
            } 
            else if (targetRoom.type === 'HS') {
                if (!hsMappings.has(sourceRoomId)) {
                    hsMappings.set(sourceRoomId, []);
                }
                hsMappings.get(sourceRoomId)!.push(targetRoomId);
            }
        });
    });

    // Crear el nuevo array de rooms con los mapeos actualizados
    return allRooms.map(room => {
        if (!room.id) return room;

        // Obtener los mapeos para este room
        const expediaIds = expediaMappings.get(room.id) || [];
        const hbIds = hbMappings.get(room.id) || [];
        const hsIds = hsMappings.get(room.id) || [];

        // Preservar mapeos existentes que no estén en las relaciones
        const existingExpedia = Array.isArray(room.mapExpedia) ? room.mapExpedia : [];
        const existingHb = Array.isArray(room.mapHb) ? room.mapHb : [];
        const existingHs = Array.isArray(room.mapHs) ? room.mapHs : [];

        // Combinar y eliminar duplicados
        const finalExpedia = [...new Set([...existingExpedia, ...expediaIds])];
        const finalHb = [...new Set([...existingHb, ...hbIds])];
        const finalHs = [...new Set([...existingHs, ...hsIds])];

        return {
            ...room,
            mapExpedia: finalExpedia,
            mapHb: finalHb,
            mapHs: finalHs
        };
    });
}
}
