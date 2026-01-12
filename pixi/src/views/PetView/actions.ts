//Temporary keyboard controls, to be aligned with rpi keys

import {lifeStore} from "../../states/LifeState.ts";

export function petViewControl() {
    window.addEventListener("keydown", (event) => {
        const store = lifeStore.getState();

        switch (event.key) {
            case "a":
                store.feed();
                break;
            case "q":
                store.kiss();
                break;
            case "e":
                playPet();
                break;
        }
    });
}



function playPet(){
    //navigate to games view, add fun points after game
}
