import {Application, Container} from "pixi.js";
import {PetView} from "./views/PetView/PetView.ts";
import {EmotionsView} from "./views/EmotionsView/EmotionsView.ts";
import {DaysView} from "./views/DaysView/DaysView.ts";
import {kState} from "./states/k.ts";
import {monitorTime} from "./states/TimeState.ts";
import {ReceivedMessagesView} from "./views/ReceivedMessagesView/ReceivedMessagesView.ts";
import {db} from "./db.ts";
import {viewStore} from "./states/ViewState.ts";
import {removePetViewControl} from "./views/PetView/actions.ts";
import {removeEmotionViewControl} from "./views/EmotionsView/Emotion.ts";
import {importCalendarEvents} from "./views/DaysView/importCalendarEvents.ts";
import {createPetViewControls} from "./views/PetView/controls.ts";
import {createReceivedMessagesViewControls} from "./views/ReceivedMessagesView/controls.ts";
import {createDaysViewControls} from "./views/DaysView/controls.ts";
import {mState} from "./states/m.ts";

(async () => {
    const app = new Application();

    // APP INIT
    await app.init(
        {
            height: 240, width: 320,
            antialias: false,
            resolution: window.devicePixelRatio,
            autoDensity: true,
            backgroundColor: '#f8f9fa'
        });
    document.getElementById("pixi-container")!.appendChild(app.canvas);
    const characterState = mState;
    monitorTime();
    await importCalendarEvents();
    // VIEWS
    let activeView: Container | undefined;
    let activeControlsRemove: (() => void) | undefined;
    const views = [
        async () => await PetView(characterState),
        () => EmotionsView(),
        async () => await ReceivedMessagesView(),
        async () => await DaysView(),
    ]
    const controls = [
        () => createPetViewControls(switchToNextView),
        () => createReceivedMessagesViewControls(switchToNextView),
        () => createReceivedMessagesViewControls(switchToNextView),
        () => createDaysViewControls(switchToNextView),
    ]
    viewStore.subscribe(async (state) => {
        const view = await views[state.activeViewIndex]();
        activeControlsRemove = controls[state.activeViewIndex]();
        activeView = view;

        app.stage.addChild(view);
    })
    viewStore.getState().setActiveView(0);

    async function switchToNextView() {
        if (activeView) app.stage.removeChild(activeView);
        activeView?.destroy();
        activeView = undefined;
        activeControlsRemove?.();
        activeControlsRemove = undefined;
        const activeViewIndex = viewStore.getState().activeViewIndex;
        let nextIndex = 0;
        if (activeViewIndex === 0) {
            removePetViewControl();
            nextIndex = 1;
        } else if (activeViewIndex === 1) {
            removeEmotionViewControl();
            nextIndex = 2;
        } else if (activeViewIndex === 2) {
            if (db) await db.from('messages').delete().eq('recipient', 1);
            nextIndex = 3
        }
        viewStore.getState().setActiveView(nextIndex);
    }
})();
