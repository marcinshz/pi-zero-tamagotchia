import {createStore} from "zustand/vanilla";
import {persist} from "zustand/middleware";

export interface LifeState {
    love: number;
    food: number;
    fun: number;
    actionPending: (() => void) | undefined;
}

type LifeStore = LifeState & {
    feed: () => void;
    kiss: () => void;
    play: () => void;
    decrease: () => void;
    setActionPending: (actionPending: (() => void) | undefined) => void;
};

export const lifeStore = createStore<LifeStore>()(
    persist(
        (set) => ({
            love: 50,
            food: 50,
            fun: 50,
            actionPending: undefined,
            feed: () => set(s => ({food: Math.min(100, s.food + 25)})),
            kiss: () => set(s => ({love: Math.min(100, s.love + 25)})),
            play: () => set(s => ({fun: Math.min(100, s.fun + 25)})),
            decrease: () => set(s => ({
                fun: Math.max(0, s.fun - 25),
                love: Math.max(0, s.love - 25),
                food: Math.max(0, s.food - 25),
            })),
            setActionPending: (actionPending) => set(() => ({actionPending})),
        }),
        {name: "lifeState"}
    )
);
