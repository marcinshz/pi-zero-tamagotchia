import {Application} from "pixi.js";
import {PetView} from "./views/PetView/PetView.ts";
import {CommunicationView} from "./views/CommunicationView";
import {DaysView} from "./views/DaysView";
import {kState} from "./states/k.ts";
import { mState } from "./states/m.ts";
import {monitorTime} from "./views/PetView/TimeState.ts";

(async () => {
    const app = new Application();

    // APP INIT
    await app.init(
    {
        height: 240, width: 320,  
        antialias: false,
        resolution: window.devicePixelRatio,
        autoDensity: true,
        backgroundColor:'#f8f9fa'
    });
    document.getElementById("pixi-container")!.appendChild(app.canvas);
    const characterState = kState;
    monitorTime();
    // VIEWS
    const petView = await PetView(app.screen.width, app.screen.height, characterState);
    const communicationView = CommunicationView(app.screen.width, app.screen.height);
    const daysView = DaysView(app.screen.width, app.screen.height);
    app.stage.addChild(petView, communicationView, daysView);
    const views = [petView, communicationView, daysView];
    let currentViewIndex = 0;
    petView.visible = true;
    communicationView.visible = false;
    daysView.visible = false;

    function switchToNextView() {
        views[currentViewIndex].visible = false;
        currentViewIndex = (currentViewIndex + 1) % views.length;
        views[currentViewIndex].visible = true;
    }

    // Keyboard control: Press "d" to switch views
    window.addEventListener("keydown", (event) => {
        if (event.key === "d") {
            switchToNextView();
        }
    });
})();
