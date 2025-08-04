import { useRelationsStore } from '../stores/relationsStore';

export const useRelations = () => {
  const { relations, loading, error, addRelation, removeRelation, setRelations } = useRelationsStore(
    (state) => state
  );
  return { relations, loading, error, addRelation, removeRelation, setRelations };
};