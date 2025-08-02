import { useRoomsRelationsStore } from '../stores/roomsRelationsStore';

export const useRelations = () => {
  const { relations, loading, error, addRelation, removeRelation, setRelations } = useRoomsRelationsStore(
    (state) => state
  );
  return { relations, loading, error, addRelation, removeRelation, setRelations };
};