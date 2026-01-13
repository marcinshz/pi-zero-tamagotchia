import {Application} from "pixi.js";
import {PetView} from "./views/PetView/PetView.ts";
import {EmotionsView} from "./views/EmotionsView/EmotionsView.ts";
import {DaysView} from "./views/DaysView/DaysView.ts";
import {kState} from "./states/k.ts";
import {monitorTime} from "./states/TimeState.ts";
import {eventStore} from "./states/EventsState.ts";
import {handleSwitchViews} from "./handleSwitchViews.ts";
import {ReceivedMessagesView} from "./views/ReceivedMessagesView/ReceivedMessagesView.ts";

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
    eventStore.getState().importEvents();
    // VIEWS
    const petView = await PetView(characterState);
    const communicationView = EmotionsView();
    const receivedMessagesView = ReceivedMessagesView();
    const daysView = await DaysView();
    app.stage.addChild(petView, communicationView, receivedMessagesView, daysView);
    const views = [petView, communicationView, receivedMessagesView, daysView];
    let currentViewIndex = 0;
    petView.visible = true;
    communicationView.visible = false;
    receivedMessagesView.visible = false;
    daysView.visible = false;

    function switchToNextView() {
        views[currentViewIndex].visible = false;
        currentViewIndex = (currentViewIndex + 1) % views.length;
        views[currentViewIndex].visible = true;
    }
    handleSwitchViews(switchToNextView)
})();
