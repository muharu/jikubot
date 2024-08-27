import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

interface AutoSaveContextProps {
  autoSaving: boolean;
  setAutoSaving: (state: boolean) => void;
}

const AutoSaveContext = createContext<AutoSaveContextProps | undefined>(
  undefined,
);

export const AutoSaveProvider = ({ children }: { children: ReactNode }) => {
  const [autoSaving, setAutoSaving] = useState(false);

  return (
    <AutoSaveContext.Provider value={{ autoSaving, setAutoSaving }}>
      {children}
    </AutoSaveContext.Provider>
  );
};

export const useAutoSave = () => {
  const context = useContext(AutoSaveContext);
  if (!context) {
    throw new Error("useAutoSave must be used within an AutoSaveProvider");
  }
  return context;
};
