import { create } from "zustand";

interface CommentSectionState {
  isCommentSectionOpen: boolean;
  toggleCommentSection: () => void;
}

export const useCommentSectionStore = create<CommentSectionState>((set) => ({
  isCommentSectionOpen: false,
  toggleCommentSection: () =>
    set((state) => ({ isCommentSectionOpen: !state.isCommentSectionOpen })),
}));
