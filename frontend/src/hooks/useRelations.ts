import { useRelationsStore } from '../stores/relationsStore';

export const useRelations = () => {
  const { relations, loading, error, modified, addRelation, removeRelation, setRelations } = useRelationsStore(
    (state) => state
  );
  return { relations, loading, error, modified, addRelation, removeRelation, setRelations };
};