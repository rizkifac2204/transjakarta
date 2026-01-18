"use client";

import { createContext, useState, useContext } from "react";

const ArmadaContext = createContext(null);

export const useArmadaContext = () => {
  const context = useContext(ArmadaContext);
  return context;
};

export default function ArmadaProvider({ initialValue, children }) {
  const [armada, setArmada] = useState(initialValue);

  return (
    <ArmadaContext.Provider value={{ armada, setArmada }}>
      {children}
    </ArmadaContext.Provider>
  );
}
