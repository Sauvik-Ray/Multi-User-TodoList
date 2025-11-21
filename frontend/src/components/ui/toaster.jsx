"use client";

import { createContext, useState } from "react";
import { Toast } from "./toast";

export const ToastContext = createContext(null);

export function ToasterProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant }) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, title, description, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
