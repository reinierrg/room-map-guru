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
            id: !isNaN(room.id) ? parseInt(room.id) : room.id,
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
    ): Map<number, number> {
        // Crear un mapa de rooms por ID para acceso rápido
        const roomsById = new Map<number, IRoom>()
        allRooms.forEach((room) => {
            if (room.id) {
                roomsById.set(room.id, room)
            }
        })

        const relationMap: Map<number, number> = new Map()

        // Procesar cada relación para agrupar por tipo de room destino
        Object.entries(relations).forEach(
            ([sourceRoomIdStr, targetRoomIds]) => {
                const sourceRoomId = parseInt(sourceRoomIdStr)
                const sourceRoom = roomsById.get(sourceRoomId)

                if (!sourceRoom) return

                targetRoomIds.forEach((targetRoomId) => {
                    const targetRoom = roomsById.get(targetRoomId)
                    if (!targetRoom) return

                    relationMap.set(targetRoomId, sourceRoomId)
                })
            }
        )


        return relationMap;

        // Crear el nuevo array de rooms con los mapeos actualizados
        /*
    return allRooms.map(room => {
        if (!room.id) return room;

        const map = relationMap.get(room.id);
        return {
            id: room.id,
            map,
            name: room.name,
            price: room.price,
            type: room.type,
            uri: room.uri
        };
    });*/
    }
}
