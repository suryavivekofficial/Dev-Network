import { create } from "zustand";

interface PostState {
  selected: "for you" | "following";
  changeSelectionToFollowing: () => void;
  changeSelectionToForYou: () => void;
}

export const usePostStore = create<PostState>((set) => ({
  selected: "for you",
  changeSelectionToFollowing: () => set(() => ({ selected: "following" })),
  changeSelectionToForYou: () => set(() => ({ selected: "for you" })),
}));
