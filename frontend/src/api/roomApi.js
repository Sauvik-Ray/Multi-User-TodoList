import api from "./api";

// Create Room
export const createRoom = (name, username) =>
  api.post(`/rooms`, {
    name,
    username,
  });

// Join Room
export const joinRoom = (joinKey) =>
  api.post(`/rooms/join`, {
    joinKey,
  });

// Get Room Details
export const getRoom = (roomId) => api.get(`/rooms/${roomId}`);

// Update Room (requires adminKey)
export const updateRoom = (roomId, name, adminKey) =>
  api.put(`/rooms/${roomId}`, {
    name,
    adminKey,
  });

// Delete Room (requires adminKey)
export const deleteRoom = (roomId, adminKey) =>
  api.delete(`/rooms/${roomId}`, {
    data: { adminKey }, // DELETE requests must send body in `data`
  });
