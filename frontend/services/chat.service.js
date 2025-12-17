import api from './api';

export const chatService = {
  sendMessage: async (message) => {
    // const response = await api.post('/chat', { message });
    // return response.data;
    return { 
      id: Date.now(), 
      text: 'This is a demo response from the AI assistant.',
      from: 'bot',
    };
  },

  getHistory: async () => {
    // const response = await api.get('/chat/history');
    // return response.data;
    return [];
  },
};
