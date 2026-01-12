import {createStore} from "zustand/vanilla";
import {persist} from "zustand/middleware";
import {lifeStore} from "./LifeState.ts";

export interface TimeState {
    lastDecrease: Date;
}

type TimeStore = TimeState & {
    decrease: () => void;
};

export const timeStore = createStore<TimeStore>()(
    persist(
        (set) => ({
            lastDecrease: new Date(),
            decrease: () => set(s => {
                const now = new Date();
                if (Math.abs(now.getTime() - new Date(s.lastDecrease).getTime()) > 1800000) {
                    s.lastDecrease = now;
                    lifeStore.getState().decrease();
                    return ({lastDecrease: now});
                }
                return ({lastDecrease: s.lastDecrease})
            }),
        }),
        {name: "timeState"}
    )
);

export function monitorTime() {
    setInterval(() => {
        timeStore.getState().decrease();
    }, 600000);
}