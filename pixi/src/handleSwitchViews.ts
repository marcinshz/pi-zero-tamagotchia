export function handleSwitchViews(switchToNextView: () => void) {
    let lastTapTime = 0;
    let keyDownTime = 0;
    let holdTriggered = false;

    const DOUBLE_TAP_DELAY = 300;
    const HOLD_THRESHOLD = 500; // ms – musi być mniejsze niż 1000 z emotki

    window.addEventListener("keydown", (event) => {
        if (event.key !== "d") return;

        keyDownTime = performance.now();
        holdTriggered = false;

        // timer do rozpoznania hold
        setTimeout(() => {
            if (performance.now() - keyDownTime >= HOLD_THRESHOLD) {
                holdTriggered = true; // zablokuj double tap
            }
        }, HOLD_THRESHOLD);
    });

    window.addEventListener("keyup", (event) => {
        if (event.key !== "d") return;

        const pressDuration = performance.now() - keyDownTime;

        // Jeśli to był HOLD → nie robimy double tap
        if (pressDuration >= HOLD_THRESHOLD || holdTriggered) {
            return;
        }

        // Logika double tap
        const now = Date.now();
        if (now - lastTapTime < DOUBLE_TAP_DELAY) {
            switchToNextView();
            lastTapTime = 0;
        } else {
            lastTapTime = now;
        }
    });
}
