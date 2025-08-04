import { useRoomsStore } from '../stores/roomsStore';

export const useRooms = () => {
  const { rooms, loading, error, setRooms, loadRooms } = useRoomsStore((state) => state);
  return { rooms, loading, error, setRooms, loadRooms };
};