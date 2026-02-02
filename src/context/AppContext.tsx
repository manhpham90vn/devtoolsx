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

interface EncoderState {
  inputText: string;
  outputText: string;
  mode: "encode" | "decode" | null;
}

interface TimestampState {
  // Panel 1: Timestamp to Date
  tsInput: string;
  tsOutput: string;
  // Panel 2: Date to Timestamp
  dateInput: string;
  dateOutput: string;
}

interface AppState {
  diffViewer: DiffViewerState;
  jsonFormatter: JSONFormatterState;
  base64: EncoderState;
  urlEncoder: EncoderState;
  timestamp: TimestampState;
}

interface AppContextType {
  state: AppState;
  setDiffViewerState: (state: Partial<DiffViewerState>) => void;
  setJSONFormatterState: (state: Partial<JSONFormatterState>) => void;
  setBase64State: (state: Partial<EncoderState>) => void;
  setURLEncoderState: (state: Partial<EncoderState>) => void;
  setTimestampState: (state: Partial<TimestampState>) => void;
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
  base64: {
    inputText: "",
    outputText: "",
    mode: null,
  },
  urlEncoder: {
    inputText: "",
    outputText: "",
    mode: null,
  },
  timestamp: {
    tsInput: "",
    tsOutput: "",
    dateInput: "",
    dateOutput: "",
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

  const setBase64State = (newState: Partial<EncoderState>) => {
    setState((prev) => ({
      ...prev,
      base64: { ...prev.base64, ...newState },
    }));
  };

  const setURLEncoderState = (newState: Partial<EncoderState>) => {
    setState((prev) => ({
      ...prev,
      urlEncoder: { ...prev.urlEncoder, ...newState },
    }));
  };

  const setTimestampState = (newState: Partial<TimestampState>) => {
    setState((prev) => ({
      ...prev,
      timestamp: { ...prev.timestamp, ...newState },
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setDiffViewerState,
        setJSONFormatterState,
        setBase64State,
        setURLEncoderState,
        setTimestampState,
      }}
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
