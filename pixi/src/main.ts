import {Application} from "pixi.js";
import {PetView} from "./views/PetView";
import {CommunicationView} from "./views/CommunicationView";
import {DaysView} from "./views/DaysView";

(async () => {
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({background: "#F0EFEB"});

    // Append the application canvas to the document body
    document.getElementById("pixi-container")!.appendChild(app.canvas);

    // Create views
    const petView = PetView(app.screen.width, app.screen.height);
    const communicationView = CommunicationView(app.screen.width, app.screen.height);
    const daysView = DaysView(app.screen.width, app.screen.height);

    // Add all views to stage (initially hidden)
    app.stage.addChild(petView, communicationView, daysView);

    // View management
    const views = [petView, communicationView, daysView];
    let currentViewIndex = 0;
    petView.visible = true;
    communicationView.visible = false;
    daysView.visible = false;

    // Function to switch to next view
    function switchToNextView() {
        views[currentViewIndex].visible = false;
        currentViewIndex = (currentViewIndex + 1) % views.length;
        views[currentViewIndex].visible = true;
    }

    // Keyboard control: Press "e" to switch views
    window.addEventListener("keydown", (event) => {
        if (event.key === "e" || event.key === "E") {
            switchToNextView();
        }
    });
})();
