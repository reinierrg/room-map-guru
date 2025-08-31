import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface IRoomRelations {
  [key: number]: number[];
}

interface RelationsState {
    relations: IRoomRelations
    loading: boolean
    error: string | null
    modified: boolean;

    setRelations: (newRelations: IRoomRelations, modified?: boolean) => void;
    addRelation: (supervisorId: number, subordinateId: number) => void
    removeRelation: (supervisorId: number, subordinateId: number) => void
    deleteRelation: (personId: number) => void
}

export const useRelationsStore = create<RelationsState>()(
    devtools(
        (set) => ({
            relations: [],
            loading: false,
            error: null,
            modified: true,

            addRelation: (supervisorId, subordinateId) =>
                set((state) => ({
                    relations: {
                        ...state.relations,
                        [supervisorId]: [
                            ...(state.relations[supervisorId] || []),
                            subordinateId,
                        ],
                    },
                    modified: true
                })),

            removeRelation: (supervisorId, subordinateId) =>
                set((state) => ({
                    relations: {
                        ...state.relations,
                        [supervisorId]: state.relations[supervisorId]?.filter(
                            (id) => id !== subordinateId
                        ),
                    },
                    modified: true
                })),
                
            setRelations: (newRelations, modified = true) =>
                set(() => ({
                    relations: newRelations,
                    modified,
                })),
        }),
        { name: 'relations-store' }
    )
)