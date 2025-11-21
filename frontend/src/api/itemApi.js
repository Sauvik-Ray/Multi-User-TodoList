import api from "./api";

// Create Item
export const createItem = (listId, content, username) =>
  api.post(`/items/${listId}`, { content, username });

// Get Items
export const getItems = (listId) => api.get(`/items/${listId}`);

// Update Item (SAFE - content and completed always passed)
export const updateItem = (itemId, content, completed, username) =>
  api.put(`/items/${itemId}`, {
    content: content ?? "",
    completed: completed ?? false,
    username,
  });

// Delete Item
export const deleteItem = (itemId) => api.delete(`/items/${itemId}`);
