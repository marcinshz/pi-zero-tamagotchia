import {Application, Container} from "pixi.js";
import {PetView} from "./views/PetView/PetView.ts";
import {EmotionsView} from "./views/EmotionsView/EmotionsView.ts";
import {DaysView} from "./views/DaysView/DaysView.ts";
import {kState} from "./states/k.ts";
import {monitorTime} from "./states/TimeState.ts";
import {eventStore} from "./states/EventsState.ts";
import {handleSwitchViews} from "./handleSwitchViews.ts";
import {ReceivedMessagesView} from "./views/ReceivedMessagesView/ReceivedMessagesView.ts";
import {initializeDB} from "./db.ts";
import {viewStore} from "./states/ViewState.ts";
import {removePetViewControl} from "./views/PetView/actions.ts";
import {removeEmotionViewControl} from "./views/EmotionsView/Emotion.ts";

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
    const characterState = kState;
    monitorTime();
    const db = initializeDB();
    if (db) {
        const calendarEvents = await db.from('calendarEvent').select().order('date', {ascending: true}).then(res => res.data);
        if (calendarEvents) eventStore.getState().setEvents(calendarEvents);
    } else {
        return;
    }
    // VIEWS
    let activeView: Container | undefined;
    const views = [
        async () => await PetView(characterState),
        () => EmotionsView(db),
        async () => await ReceivedMessagesView(db),
        async () => await DaysView(),
    ]
    viewStore.subscribe(async (state) => {
        const view = await views[state.activeViewIndex]();
        activeView = view;

        app.stage.addChild(view);
    })
    viewStore.getState().setActiveView(0);

    function switchToNextView() {
        if (activeView) app.stage.removeChild(activeView);
        activeView?.destroy();
        activeView = undefined;
        const activeViewIndex = viewStore.getState().activeViewIndex;
        let nextIndex = 0;
        if (activeViewIndex === 0) {
            removePetViewControl();
            nextIndex = 1;
        } else if (activeViewIndex === 1) {
            removeEmotionViewControl();
            nextIndex = 2;
        } else if (activeViewIndex === 2) nextIndex = 3
        viewStore.getState().setActiveView(nextIndex);
    }

    handleSwitchViews(switchToNextView)
})();
