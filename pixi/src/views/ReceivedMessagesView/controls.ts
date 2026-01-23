export function createReceivedMessagesViewControls(
  switchToNextView: () => void,
) {
  let lastTapTime = 0;
  const DOUBLE_TAP_DELAY = 300;

  const onKeyUp = (event: KeyboardEvent) => {
    if (event.key !== "d") return;

    const now = Date.now();
    if (now - lastTapTime < DOUBLE_TAP_DELAY) {
      switchToNextView();
      lastTapTime = 0;
    } else {
      lastTapTime = now;
    }
  };

  window.addEventListener("keyup", onKeyUp);

  return () => {
    window.removeEventListener("keyup", onKeyUp);
  };
}
