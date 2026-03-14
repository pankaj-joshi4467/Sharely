import { create } from "zustand";

interface PostStore {
  inputValue: string;
  isPosting: boolean;
  isTyping: boolean;
  lastUpdatedAt: Date | null;

  setInputValue: (val: string) => void;
  setIsPosting: (bool: boolean) => void;
  setIsTyping: (bool: boolean) => void;
  resetInput: () => void;
  setLastUpdatedAt: (date: Date) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  inputValue: "",
  isPosting: false,
  isTyping: false,
  lastUpdatedAt: null,

  setInputValue: (val) => set({ inputValue: val, isTyping: true }),
  setIsPosting: (bool) => set({ isPosting: bool }),
  setIsTyping: (bool) => set({ isTyping: bool }),
  resetInput: () => set({ inputValue: "", isTyping: false }),
  setLastUpdatedAt: (date) => set({ lastUpdatedAt: date }),
}));
