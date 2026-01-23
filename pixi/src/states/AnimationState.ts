import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

export enum Animations {
  IDLE = "/idle.mp4",
  KISS = "/kiss.mp4",
  FEED = "/feed.mp4",
  HUNGRY = "/hungry.mp4",
  BORED = "/bored.mp4",
  LONELY = "/lonely.mp4",
}

export interface TimeState {
  animation: Animations;
  nextAnimation: Animations;
  isPlaying: boolean;
}

type TimeStore = TimeState & {
  animationChange: (animation: Animations) => void;
  setNextAnimation: (animation: Animations) => void;
  animationEnd: () => void;
  animationPlay: () => void;
};

export const animationStore = createStore<TimeStore>()(
  persist(
    (set) => ({
      animation: Animations.IDLE,
      nextAnimation: Animations.IDLE,
      isPlaying: true,
      animationChange: (animation: Animations) => set({ animation }),
      setNextAnimation: (animation: Animations) =>
        set({ nextAnimation: animation }),
      animationEnd: () => set({ isPlaying: false }),
      animationPlay: () => set({ isPlaying: true }),
    }),
    { name: "animationState" },
  ),
);
