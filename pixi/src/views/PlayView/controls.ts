import { getPlayViewInstance } from "./PlayView";
import { lifeStore } from "../../states/LifeState.ts";

export function createPlayViewControls(
  switchToNextView: (viewIndex?: number) => void,
) {
  const playView = getPlayViewInstance();
  if (!playView) return () => {};

  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === "a") {
      playView.jump();
    } else if (e.key === "q") {
      lifeStore.getState().play();
      playView.startOrRestart();
    } else if (e.key === "e") {
      switchToNextView(0);
    }
  };

  window.addEventListener("keydown", keyDownHandler);

  return () => {
    window.removeEventListener("keydown", keyDownHandler);
  };
}
