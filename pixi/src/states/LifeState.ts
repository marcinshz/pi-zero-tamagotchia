import {createStore} from "zustand/vanilla";
import {persist} from "zustand/middleware";

export interface LifeState {
    love: number;
    food: number;
    fun: number;
    gameRecord: number;
    actionPending: (() => void) | undefined;
    actionPendingName: string | undefined;
}

export type LifeStore = LifeState & {
    feed: () => void;
    kiss: () => void;
    play: () => void;
    decrease: () => void;
    setActionPending: (actionPending: (() => void) | undefined) => void;
    setActionPendingName: (actionPendingName: string | undefined) => void;
    setGameRecord: (record: number) => void;
};

export const lifeStore = createStore<LifeStore>()(
    persist(
        (set) => ({
            love: 50,
            food: 50,
            fun: 50,
            gameRecord: 0,
            actionPending: undefined,
            actionPendingName: undefined,
            feed: () => set(s => ({food: Math.min(100, s.food + 25)})),
            kiss: () => set(s => ({love: Math.min(100, s.love + 25)})),
            play: () => set(s => ({fun: Math.min(100, s.fun + 25)})),
            decrease: () => set(s => ({
                fun: Math.max(0, s.fun - 25),
                love: Math.max(0, s.love - 25),
                food: Math.max(0, s.food - 25),
            })),
            setActionPending: (actionPending) => set(() => ({actionPending})),
            setActionPendingName: (actionPendingName) => set(() => ({actionPendingName})),
            setGameRecord: (gameRecord: number) => set(({gameRecord}))
        }),
        {name: "lifeState"}
    )
);
