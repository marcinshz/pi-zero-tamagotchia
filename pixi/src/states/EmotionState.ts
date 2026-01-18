import {createStore} from "zustand/vanilla";
import {persist} from "zustand/middleware";

export interface EmotionState {
    animatedEmoji: string | null;
    holdProgress: number;
}

type EmotionStore = EmotionState & {
    setAnimatedEmoji: (key: string | null) => void;
    setHoldProgress: (holdProgress: number) => void;
};

export const emotionStore = createStore<EmotionStore>()(
    persist(
        (set) => ({
            animatedEmoji: null,
            holdProgress: 0,
            setAnimatedEmoji: (key) => set({animatedEmoji: key}),
            setHoldProgress: (holdProgress: number) => set({holdProgress}),
        }),
        {name: "emotionStore"}
    )
);
