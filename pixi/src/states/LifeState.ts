import {LifeState} from "./types.ts";

function initializeLifeState(): LifeState {
    const lifeState: LifeState = {
        love: 50,
        food: 50,
        fun: 50
    };
    localStorage.setItem("lifeState", JSON.stringify(lifeState));
    return lifeState;
}

export function getLifeState(): LifeState {
    const lifeState = localStorage.getItem('lifeState');
    if (lifeState) {
        return JSON.parse(lifeState);
    } else {
        return initializeLifeState();
    }
}