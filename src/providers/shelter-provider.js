"use client";

import { createContext, useState, useContext } from "react";

const ShelterContext = createContext(null);

export const useShelterContext = () => {
  const context = useContext(ShelterContext);
  return context;
};

export default function ShelterProvider({ initialValue, children }) {
  const [shelter, setShelter] = useState(initialValue);

  return (
    <ShelterContext.Provider value={{ shelter, setShelter }}>
      {children}
    </ShelterContext.Provider>
  );
}
