import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

export interface ViewState {
  activeViewIndex: number;
}

type ViewStore = ViewState & {
  setActiveView: (activeViewIndex: number) => void;
};

export const viewStore = createStore<ViewStore>()(
  persist(
    (set) => ({
      activeViewIndex: 0,
      setActiveView: (activeViewIndex: number) =>
        set(() => ({ activeViewIndex })),
    }),
    { name: "viewState" },
  ),
);
