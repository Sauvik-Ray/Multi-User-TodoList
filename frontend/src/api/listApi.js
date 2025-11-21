import api from "./api";

// Create List
export const createList = (roomId, name, username) =>
  api.post(`/lists/${roomId}`, { name, username });

// Get Lists for Room
export const getListsByRoom = (roomId) => api.get(`/lists/room/${roomId}`);

// Update List
export const updateList = (listId, name, username) =>
  api.put(`/lists/${listId}`, { name, username });

// Delete List
export const deleteList = (listId) => api.delete(`/lists/${listId}`);
