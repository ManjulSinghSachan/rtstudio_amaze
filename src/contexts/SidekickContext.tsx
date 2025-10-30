import { createContext, useContext, useState, ReactNode } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SidekickContextType {
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  clearMessages: () => void;
}

const SidekickContext = createContext<SidekickContextType | undefined>(undefined);

export const SidekickProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const clearMessages = () => setMessages([]);

  return (
    <SidekickContext.Provider value={{ messages, setMessages, clearMessages }}>
      {children}
    </SidekickContext.Provider>
  );
};

export const useSidekick = () => {
  const context = useContext(SidekickContext);
  if (context === undefined) {
    throw new Error("useSidekick must be used within a SidekickProvider");
  }
  return context;
};
