// src/hooks/useRoomStorage.js
export const saveSession = (data) => {
  localStorage.setItem("session", JSON.stringify(data || {}));
};

export const getSession = () => {
  return JSON.parse(localStorage.getItem("session") || "{}");
};

export const clearSession = () => {
  localStorage.removeItem("session");
};
