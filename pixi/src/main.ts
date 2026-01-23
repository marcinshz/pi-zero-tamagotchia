/* eslint-disable @typescript-eslint/no-explicit-any */
import { Application, Container } from "pixi.js";
import { PetView } from "./views/PetView/PetView.ts";
import { EmotionsView } from "./views/EmotionsView/EmotionsView.ts";
import { DaysView } from "./views/DaysView/DaysView.ts";
import { monitorTime } from "./states/TimeState.ts";
import { ReceivedMessagesView } from "./views/ReceivedMessagesView/ReceivedMessagesView.ts";
import { db } from "./db.ts";
import { viewStore } from "./states/ViewState.ts";
import { importCalendarEvents } from "./views/DaysView/importCalendarEvents.ts";
import { createPetViewControls } from "./views/PetView/controls.ts";
import { createReceivedMessagesViewControls } from "./views/ReceivedMessagesView/controls.ts";
import { createDaysViewControls } from "./views/DaysView/controls.ts";
import { createEmotionsViewControls } from "./views/EmotionsView/controls.ts";
import { createPlayViewControls } from "./views/PlayView/controls.ts";
import { PlayView } from "./views/PlayView/PlayView.ts";

(async () => {
  const app = new Application();

  // APP INIT
  await app.init({
    height: 240,
    width: 320,
    antialias: false,
    resolution: window.devicePixelRatio,
    autoDensity: true,
    backgroundColor: "#f8f9fa",
  });
  document.getElementById("pixi-container")!.appendChild(app.canvas);
  monitorTime();
  await importCalendarEvents();
  const userId = Number(localStorage.getItem("userId"));
  if (!userId) return;
  // VIEWS
  let activeView: Container | undefined;
  let activeControlsRemove: (() => void) | undefined;
  const views = [
    async () => await PetView(),
    async () => await EmotionsView(),
    async () => await ReceivedMessagesView(),
    async () => await DaysView(),
    async () => await PlayView(),
  ];
  const controls = [
    () => createPetViewControls(switchToNextView),
    () => createEmotionsViewControls(switchToNextView),
    () => createReceivedMessagesViewControls(switchToNextView),
    () => createDaysViewControls(switchToNextView),
    () => createPlayViewControls(switchToNextView),
  ];
  viewStore.subscribe(async (state) => {
    const view = await views[state.activeViewIndex]();
    activeControlsRemove = controls[state.activeViewIndex]();
    activeView = view;

    app.stage.addChild(view);
  });
  viewStore.getState().setActiveView(0);

  async function switchToNextView(viewIndex?: number) {
    if (activeView) app.stage.removeChild(activeView);
    const activeViewIndex = viewStore.getState().activeViewIndex;
    if (activeView && (activeView as any).cleanup) {
      (activeView as any).cleanup();
    }
    if (activeViewIndex !== 4) activeView?.destroy();
    activeView = undefined;

    activeControlsRemove?.();
    activeControlsRemove = undefined;

    const nextIndex =
      viewIndex !== undefined
        ? viewIndex
        : (activeViewIndex + 1) % (views.length - 1);

    if (activeViewIndex === 2) {
      if (db) await db.from("messages").delete().eq("recipient", userId);
    }

    viewStore.getState().setActiveView(nextIndex);
  }
})();
