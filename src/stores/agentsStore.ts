import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { IAgent, IdAgent } from '../services/room/room.types'
import { initialValuesAgent } from './initialValus'

interface AgentsState {
    agents: IAgent[]
    setAgents: (newRooms: IAgent[]) => void
    getAgentById:(id: IdAgent) => IAgent
}

export const useAgentsStore = create<AgentsState>()(
    devtools(
        (set, get) => ({
            agents: initialValuesAgent,
            
            setAgents: (agents: IAgent[]) =>
                set(() => ({agents})),

            getAgentById: (id: IdAgent) =>
                get().agents.find((type) => type.id === id),
            
        }),
        { name: 'rooms-store' }
    )
)
