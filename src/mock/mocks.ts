const mockRooms = [
    // Gerentes base
    { id: 1, name: 'Room1', type: 'internal', position: 'Room1 Internal' },
    { id: 2, name: 'Room2', type: 'internal', position: 'Room2 Internal' },
    { id: 3, name: 'Room3', type: 'internal', position: 'Room3 Internal' },
    { id: 33, name: 'Room33', type: 'internal', position: 'Room33 Internal' },

    // Otros empleados
    { id: 4, name: 'Room4', type: 'expedia', position: 'Room4 Expedia' },
    { id: 5, name: 'Room5', type: 'expedia', position: 'Room5 Expedia' },
    { id: 6, name: 'Room6', type: 'expedia', position: 'Room6 Expedia' },
    { id: 7, name: 'Room7', type: 'expedia', position: 'Room7 Expedia' },
    { id: 8, name: 'Room8', type: 'hotelbeds', position: 'Room8 Hotelbeds' },
    { id: 9, name: 'Room9', type: 'hotelbeds', position: 'Room9 Hotelbeds' },
    { id: 10, name: 'Room10', type: 'hotelbeds', position: 'Room10 Hotelbeds' },
    {
        id: 11,
        name: 'Room11',
        type: 'hotelunico',
        position: 'Room11 HotelUnico',
    },
    {
        id: 12,
        name: 'Room12',
        type: 'hotelunico',
        position: 'Room12 HotelUnico',
    },
    {
        id: 13,
        name: 'Room13',
        type: 'hotelunico',
        position: 'Room13 HotelUnico',
    },
]

const mockHotels = [
    {
        id: '1',
        type: 'Interno',
        name: 'Internal',
        color: 'bg-blue-500',
        icon: '👔',
    },
    {
        id: '2',
        type: 'Expedia',
        name: 'Expedia',
        color: 'bg-green-500',
        icon: '💻',
    },
    {
        id: '3',
        type: 'HB',
        name: 'Hotelbeds',
        color: 'bg-purple-500',
        icon: '🎨',
    },
    {
        id: '4',
        type: 'HS',
        name: 'HotelUnico',
        color: 'bg-orange-500',
        icon: '📊',
    },
]

export { mockRooms, mockHotels }
