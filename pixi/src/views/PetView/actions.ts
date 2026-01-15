//Temporary keyboard controls, to be aligned with rpi keys

import {lifeStore} from "../../states/LifeState.ts";
import {Animations, animationStore} from "../../states/AnimationState.ts";

function onPetKeyDown(event: KeyboardEvent){
    const lifeStoreLocal = lifeStore.getState();
    const animationStoreLocal = animationStore.getState();

    switch (event.key) {
        case "a":
            lifeStoreLocal.setActionPending(lifeStoreLocal.feed);
            lifeStoreLocal.setActionPendingName('Feed');
            animationStoreLocal.setNextAnimation(Animations.FEED);
            break;
        case "q":
            lifeStoreLocal.setActionPending(lifeStoreLocal.kiss);
            lifeStoreLocal.setActionPendingName('Kiss');
            animationStoreLocal.setNextAnimation(Animations.KISS);
            break;
        case "e":
            playPet();
            break;
        case "k":
            lifeStoreLocal.decrease();
            break;
    }
}

export function petViewControl() {
    window.addEventListener("keydown", onPetKeyDown);
}

export function removePetViewControl() {
    window.removeEventListener("keydown", onPetKeyDown);
}

function playPet(){
    //navigate to games view, add fun points after game
}
