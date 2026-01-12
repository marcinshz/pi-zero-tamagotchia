import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

export interface LifeState {
    love: number;
    food: number;
    fun: number;
}

type LifeStore = LifeState & {
    feed: () => void;
    kiss: () => void;
    play: () => void;
};

export const lifeStore = createStore<LifeStore>()(
    persist(
        (set) => ({
            love: 50,
            food: 50,
            fun: 50,

            feed: () => set(s => ({ food: Math.min(100, s.food + 25) })),
            kiss: () => set(s => ({ love: Math.min(100, s.love + 25) })),
            play: () => set(s => ({ fun: Math.min(100, s.fun + 25) })),
        }),
        { name: "lifeState" }
    )
);
