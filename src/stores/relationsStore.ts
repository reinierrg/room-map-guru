import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface RelationsState {
    relations: { [key: number]: number[] }
    loading: boolean
    error: string | null

    setRelations: (newRelations: { [key: number]: number[] }) => void;
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

            addRelation: (supervisorId, subordinateId) =>
                set((state) => ({
                    relations: {
                        ...state.relations,
                        [supervisorId]: [
                            ...(state.relations[supervisorId] || []),
                            subordinateId,
                        ],
                    },
                })),

            removeRelation: (supervisorId, subordinateId) =>
                set((state) => ({
                    relations: {
                        ...state.relations,
                        [supervisorId]: state.relations[supervisorId]?.filter(
                            (id) => id !== subordinateId
                        ),
                    },
                })),
                
            setRelations: (newRelations) =>
                set(() => ({
                    relations: newRelations,
                })),
        }),
        { name: 'relations-store' }
    )
)