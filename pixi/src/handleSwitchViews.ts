export function handleSwitchViews(switchToNextView: () => void) {
    let lastPressTime = 0;
    const DOUBLE_TAP_DELAY = 300;

    window.addEventListener("keydown", (event) => {
        if (event.key !== "d") return;

        const now = Date.now();

        if (now - lastPressTime < DOUBLE_TAP_DELAY) {
            switchToNextView();
            lastPressTime = 0;
        } else {
            lastPressTime = now;
        }
    });
}