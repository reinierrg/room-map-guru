import { useHotelsStore } from '../stores/hotelsStore';

export const useHotels = () => {
  const { hotels, hotelsTemp, loading, error, setHotels, loadHotels, searchHotels } = useHotelsStore(
    (state) => state
  );
  return { hotels, hotelsTemp, loading, error, setHotels, loadHotels, searchHotels };
};