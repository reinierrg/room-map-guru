import { useRoomsStore } from '../stores/roomsStore';

export const useRooms = () => {
  const { rooms, loading, error, fetchRooms } = useRoomsStore(
    (state) => state
  );
  return { rooms, loading, error, fetchRooms };
};