import { useRoomsStore } from '../stores/roomsStore';

export const useRooms = () => {
  const { rooms, loading, error, setRooms, fetchRooms } = useRoomsStore(
    (state) => state
  );
  return { rooms, loading, error, setRooms, fetchRooms };
};