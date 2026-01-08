// DEPRECATED: Do not use global stores for derived state. Use backend services directly.
// Zustand store placeholder for task state
export const useTaskStore = () => ({
  tasks: [],
  filter: 'all',
});
