/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";

interface DiffViewerState {
  leftText: string;
  rightText: string;
  showDiff: boolean;
  language: string;
}

interface JSONFormatterState {
  inputText: string;
  outputText: string;
  error: string;
}

interface AppState {
  diffViewer: DiffViewerState;
  jsonFormatter: JSONFormatterState;
}

interface AppContextType {
  state: AppState;
  setDiffViewerState: (state: Partial<DiffViewerState>) => void;
  setJSONFormatterState: (state: Partial<JSONFormatterState>) => void;
}

const defaultState: AppState = {
  diffViewer: {
    leftText: "",
    rightText: "",
    showDiff: false,
    language: "json",
  },
  jsonFormatter: {
    inputText: "",
    outputText: "",
    error: "",
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  const setDiffViewerState = (newState: Partial<DiffViewerState>) => {
    setState((prev) => ({
      ...prev,
      diffViewer: { ...prev.diffViewer, ...newState },
    }));
  };

  const setJSONFormatterState = (newState: Partial<JSONFormatterState>) => {
    setState((prev) => ({
      ...prev,
      jsonFormatter: { ...prev.jsonFormatter, ...newState },
    }));
  };

  return (
    <AppContext.Provider
      value={{ state, setDiffViewerState, setJSONFormatterState }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
