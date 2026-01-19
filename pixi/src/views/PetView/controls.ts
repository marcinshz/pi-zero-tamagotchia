import {lifeStore} from "../../states/LifeState";
import {Animations, animationStore} from "../../states/AnimationState";

export const DOUBLE_CLICK_EVENT = "doubleClickD";

export function createPetViewControls(switchToNextView: (viewIndex?: number) => void) {
    let lastTapTime = 0;
    let keyDownTime = 0;
    let holdTriggered = false;

    const DOUBLE_TAP_DELAY = 300;
    const HOLD_THRESHOLD = 500;

    const onKeyDown = (event: KeyboardEvent) => {
        const lifeStoreLocal = lifeStore.getState();
        const animationStoreLocal = animationStore.getState();

        switch (event.key) {
            case "d":
                keyDownTime = performance.now();
                holdTriggered = false;

                setTimeout(() => {
                    if (performance.now() - keyDownTime >= HOLD_THRESHOLD) {
                        holdTriggered = true;
                    }
                }, HOLD_THRESHOLD);
                break;

            case "a":
                lifeStoreLocal.setActionPending(lifeStoreLocal.feed);
                lifeStoreLocal.setActionPendingName("FEED");
                animationStoreLocal.setNextAnimation(Animations.FEED);
                break;

            case "q":
                lifeStoreLocal.setActionPending(lifeStoreLocal.kiss);
                lifeStoreLocal.setActionPendingName("KISS");
                animationStoreLocal.setNextAnimation(Animations.KISS);
                break;

            case "e":
                switchToNextView(4);
                break;

            case "k":
                lifeStoreLocal.decrease();
                break;
        }
    };

    const onKeyUp = (event: KeyboardEvent) => {
        if (event.key !== "d") return;

        const pressDuration = performance.now() - keyDownTime;

        if (pressDuration >= HOLD_THRESHOLD || holdTriggered) return;

        const now = Date.now();
        if (now - lastTapTime < DOUBLE_TAP_DELAY) {
            window.dispatchEvent(new CustomEvent(DOUBLE_CLICK_EVENT));
            switchToNextView();
            lastTapTime = 0;
        } else {
            lastTapTime = now;
        }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // cleanup do wywołania przy zmianie widoku
    return () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
    };
}
