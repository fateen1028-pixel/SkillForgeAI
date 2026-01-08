// DEPRECATED: Do not use global stores for derived state. Use backend services directly.
// Zustand store placeholder for roadmap state
export const useRoadmapStore = () => ({
  phases: [],
  currentPhase: 1,
  progress: 0,
});
