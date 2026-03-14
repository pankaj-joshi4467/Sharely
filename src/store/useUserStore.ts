import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  authorName: string;
  likedPostIds: string[];
  setAuthorName: (name: string) => void;
  addLikedPost: (id: string) => void;
  hasLikedPost: (id: string) => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      authorName: "",
      likedPostIds: [],
      setAuthorName: (name) => set({ authorName: name.trim() }),
      addLikedPost: (id) =>
        set((state) => ({
          likedPostIds: state.likedPostIds.includes(id)
            ? state.likedPostIds
            : [...state.likedPostIds, id],
        })),
      hasLikedPost: (id) => get().likedPostIds.includes(id),
    }),
    { name: "smedia-user-v1" }
  )
);
