import { useAgentsStore } from '../stores/agentsStore';

export const useAgents = () => {
  const { agents, setAgents, getAgentById } = useAgentsStore((state) => state);

  return { agents, setAgents, getAgentById };
};