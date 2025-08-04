import { useEffect, useState } from 'react';
import { useHotels } from './useHotels';
import { useRooms } from './useRooms';

export const useLoadRooms = () => {
  const { rooms, loadRooms } = useRooms()
  const { hotels, loadHotels } = useHotels()
      
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadHotelsFirst = async () => {
    try {
      setLoading(true);
      await loadHotels();
    } catch (error) {
      setLoading(false);
      setError('Error al cargar los hoteles');
    }
  }

  const loadRoomsSeg = async () => {
    try {
      await loadRooms(hotels)
      setLoading(false)
    } catch (error) {
      setLoading(false);
      setError('Error al cargar la habitaciones');
    }
    
  }

  useEffect(() => {
    loadHotelsFirst()
  }, [])

  useEffect(() => {
    if (hotels.length) {
      loadRoomsSeg()
    } else {
      setLoading(false)
    }   
  }, [hotels])

  
  return { rooms, loading, error };
};