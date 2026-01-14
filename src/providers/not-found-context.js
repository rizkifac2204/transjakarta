// app/context/NotFoundContext.js
"use client";
import { createContext, useContext, useState } from "react";

const NotFoundContext = createContext();

export function NotFoundProvider({ children }) {
  const [isNotFound, setIsNotFound] = useState(false);
  return (
    <NotFoundContext.Provider value={{ isNotFound, setIsNotFound }}>
      {children}
    </NotFoundContext.Provider>
  );
}

export function useNotFound() {
  return useContext(NotFoundContext);
}
