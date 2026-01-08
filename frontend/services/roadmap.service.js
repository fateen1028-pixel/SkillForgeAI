import api from './api';

export const roadmapService = {
  getRoadmap: async () => {
    const response = await api.get('/roadmap');
    return response.data;
  },

  updateProgress: async (phaseId, itemId, completed) => {
    // const response = await api.put(`/roadmap/${phaseId}/items/${itemId}`, { completed });
    // return response.data;
    return { success: true };
  },

  startSlot: async (slotId) => {
    // Use params to send slot_id as a query parameter.
    // Send an empty object as data since it's a POST request.
    const response = await api.post(`/roadmap/slot/start`, {}, {
      params: { slot_id: slotId }
    });
    return response.data;
  },
};
