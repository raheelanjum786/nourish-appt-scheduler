import api from './api';

export interface Message {
  _id: string;
  sender: string;
  content: string;
  type: 'TEXT' | 'VOICE' | 'VIDEO_CALL_REQUEST' | 'VOICE_CALL_REQUEST';
  timestamp: string;
  read: boolean;
  mediaUrl?: string;
}

export interface Chat {
  _id: string;
  participants: string[];
  messages: Message[];
  relatedTo: {
    type: 'appointment' | 'plan';
    id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const chatService = {
  // Get all chats for the current user
  getUserChats: async () => {
    try {
      const response = await api.get('/chats');
      return response.data;
    } catch (error: any) {
      console.error('Get User Chats API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch user chats');
    }
  },

  // Get a specific chat by ID
  getChatById: async (chatId: string) => {
    try {
      const response = await api.get(`/chats/${chatId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get Chat API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch chat');
    }
  },

  // Send a text message
  sendTextMessage: async (chatId: string, content: string) => {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, {
        content,
        type: 'TEXT',
      });
      return response.data;
    } catch (error: any) {
      console.error('Send Message API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  },

  // Send a voice message
  sendVoiceMessage: async (chatId: string, audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('type', 'VOICE');
      
      const response = await api.post(`/chats/${chatId}/messages/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Send Voice Message API error:', error.response?.data || error.message);
      throw new Error