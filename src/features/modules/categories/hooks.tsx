import { FilterState } from "./types";
import { create } from "zustand";
export const useFilterMain = create<FilterState>((set) => ({
  category: "Games",
  setCategory: (category: string) => set({ category }),
  resetCategory: () => set({ category: "Games" }),
}));

export type { FilterState };
