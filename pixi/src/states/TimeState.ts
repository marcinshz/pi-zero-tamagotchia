import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { lifeStore } from "./LifeState.ts";

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
      decrease: () =>
        set((s) => {
          const now = new Date();
          const timePassed = Math.abs(
            now.getTime() - new Date(s.lastDecrease).getTime(),
          );
          const decreaseCount = Math.floor(timePassed / 1800000);
          if (decreaseCount) {
            s.lastDecrease = now;
            for (let i = decreaseCount; i >= 0; i--) {
              lifeStore.getState().decrease();
            }
            return { lastDecrease: now };
          }
          return { lastDecrease: s.lastDecrease };
        }),
    }),
    { name: "timeState" },
  ),
);

export function monitorTime() {
  timeStore.getState().decrease();
  setInterval(() => {
    timeStore.getState().decrease();
  }, 60000);
}
