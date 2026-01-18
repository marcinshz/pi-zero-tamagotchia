import { db } from "../../db.ts";
import { emotionStore } from "../../states/EmotionState.ts";

export const DOUBLE_CLICK_EVENT = "doubleClickD";

const HOLD_TIME = 1000;
const DOUBLE_TAP_DELAY = 300;
const HOLD_THRESHOLD = 500; // musi być < HOLD_TIME

let holding = false;
let startTime = 0;
let blockSend = false;

let lastTapTime = 0;
let keyDownTime = 0;
let holdTriggered = false;

const emotionMap = new Map<string, string>();

function sendMessage(iconPath: string) {
    if (db) {
        db.from('messages').insert({
            recipient: 1,
            emotion: iconPath,
        }).then(res => console.log(res));
    }
}

export function registerEmotion(key: string, iconPath: string) {
    emotionMap.set(key, iconPath);
}

function animateHold() {
    if (!holding || blockSend) return;

    const t = performance.now() - startTime;
    const progress = Math.min(t / HOLD_TIME, 1);
    emotionStore.getState().setHoldProgress(progress);

    if (progress === 1) {
        holding = false;

        const key = emotionStore.getState().animatedEmoji;
        if (key) {
            const iconPath = emotionMap.get(key)!;
            sendMessage(iconPath);
        }

        emotionStore.getState().setAnimatedEmoji(null);
        emotionStore.getState().setHoldProgress(0);
        return;
    }

    requestAnimationFrame(animateHold);
}

let keyDownHandler: ((e: KeyboardEvent) => void) | null = null;
let keyUpHandler: ((e: KeyboardEvent) => void) | null = null;

export function createEmotionsViewControls(switchToNextView: () => void) {

    keyDownHandler = (e: KeyboardEvent) => {

        // --- DOUBLE TAP / HOLD na D ---
        if (e.key === "d") {
            keyDownTime = performance.now();
            holdTriggered = false;

            setTimeout(() => {
                if (performance.now() - keyDownTime >= HOLD_THRESHOLD) {
                    holdTriggered = true;
                }
            }, HOLD_THRESHOLD);
        }

        // --- EMOCJE ---
        if (holding || !emotionMap.has(e.code)) return;

        emotionStore.getState().setAnimatedEmoji(e.code);
        holding = true;
        startTime = performance.now();
        requestAnimationFrame(animateHold);
    };

    keyUpHandler = (e: KeyboardEvent) => {

        // --- DOUBLE TAP / SWITCH VIEW ---
        if (e.key === "d") {
            const pressDuration = performance.now() - keyDownTime;

            if (pressDuration < HOLD_THRESHOLD && !holdTriggered) {
                const now = Date.now();
                if (now - lastTapTime < DOUBLE_TAP_DELAY) {
                    window.dispatchEvent(new CustomEvent(DOUBLE_CLICK_EVENT));
                    switchToNextView();
                    lastTapTime = 0;
                } else {
                    lastTapTime = now;
                }
            }
        }

        // --- EMOCJE ---
        if (emotionStore.getState().animatedEmoji !== e.code) return;

        holding = false;
        emotionStore.getState().setAnimatedEmoji(null);
        emotionStore.getState().setHoldProgress(0);
    };

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    return removeEmotionControls;
}

export function removeEmotionControls() {
    if (keyDownHandler) window.removeEventListener("keydown", keyDownHandler);
    if (keyUpHandler) window.removeEventListener("keyup", keyUpHandler);

    keyDownHandler = null;
    keyUpHandler = null;
}
