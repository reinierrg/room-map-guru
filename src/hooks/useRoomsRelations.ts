import { useRoomsRelationsStore } from '../stores/roomsRelationsStore';

export const useRelations = () => {
  const { relations, loading, error, addRelation, removeRelation, deleteRelation } = useRoomsRelationsStore(
    (state) => state
  );
  return { relations, loading, error, addRelation, removeRelation, deleteRelation };
};