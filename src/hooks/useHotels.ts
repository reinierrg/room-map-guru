import { useHotelsStore } from '../stores/hotelsStore';

export const useHotels = () => {
  const { hotels, loading, error, setHotels, loadHotels } = useHotelsStore(
    (state) => state
  );
  return { hotels, loading, error, setHotels, loadHotels };
};