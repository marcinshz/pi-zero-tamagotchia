import {Container} from "pixi.js";
import {CharacterState} from "../../states/types.ts";
import {createLifeBars} from "./LifeBars.ts";
import {createVideo} from "./Video.ts";
import {createButtonLabels} from "./ButtonLabels.ts";
import {createFrame} from "./Frame.ts";
import {animationStore} from "../../states/AnimationState.ts";

export async function PetView(characterState: CharacterState): Promise<Container> {
    const view = new Container();

    await createFrame(view);

    // VIDEO
    const cleanupVideo = await createVideo({
        view,
        width: 128,
        height: 128,
        path: characterState.assetsPath + animationStore.getState().animation,
        anchorX: 0.5,
        anchorY: 0.5,
        positionX: 160,
        positionY: 90,
        borderRadius: 2
    }, characterState);

    const lifeBars = await createLifeBars();
    view.addChild(lifeBars);

    createButtonLabels(view);

    // zwracamy cleanup wraz z widokiem
    (view as any).cleanup = () => {
        cleanupVideo?.();
    };

    return view;
}

