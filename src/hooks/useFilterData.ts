import { create } from 'zustand';

type FilterDataState = {
  category: string;
  tag: string;
  tags: string[];
  setCategory: (category: string) => void;
  setTag: (tag: string) => void;
  setTags: (tag: string[]) => void;
};

export const useFilterData = create<FilterDataState>((set) => ({
  category: "",
  tag: "",
  tags: [""],
  setCategory: (category: string) => set(() => ({ category })),
  setTag: (tag: string) => set(() => ({ tag })),
  setTags: (tags: string[]) => set(() => ({ tags })),
}));
