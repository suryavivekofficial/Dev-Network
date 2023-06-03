import { create } from "zustand";

interface PostState {
  selected: "for you" | "all posts";
  changeSelectionToAll: () => void;
  changeSelectionToForYou: () => void;
}

export const usePostStore = create<PostState>((set) => ({
  selected: "for you",
  changeSelectionToAll: () => set(() => ({ selected: "all posts" })),
  changeSelectionToForYou: () => set(() => ({ selected: "for you" })),
}));
