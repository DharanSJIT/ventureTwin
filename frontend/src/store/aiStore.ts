import { create } from 'zustand';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface UiPayload {
  action: string;
  payload: any;
}

interface AiState {
  messages: ChatMessage[];
  isThinking: boolean;
  isOpen: boolean;
  uiState: UiPayload | null;
  addMessage: (msg: ChatMessage) => void;
  setThinking: (thinking: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
  setUiState: (uiState: UiPayload | null) => void;
}

export const useAiStore = create<AiState>((set) => ({
  messages: [],
  isThinking: false,
  isOpen: false,
  uiState: null,
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setThinking: (thinking) => set({ isThinking: thinking }),
  setIsOpen: (isOpen) => set({ isOpen }),
  setUiState: (uiState) => set({ uiState }),
}));
