import {Container} from "pixi.js";
import {CharacterState} from "../../states/types.ts";
import {createLifeBars} from "./LifeBars.ts";
import {createVideo} from "./Video.ts";
import {createButtonLabels} from "./ButtonLabels.ts";
import {createFrame} from "./Frame.ts";
import {petViewControl} from "./actions.ts";
import {animationStore} from "../../states/AnimationState.ts";

export async function PetView(width: number, height: number, characterState: CharacterState): Promise<Container> {
    const view = new Container();

    // CHARACTER FRAME
    await createFrame(view, width);

    // VIDEO
    await createVideo({
        view,
        width: 128,
        height: 128,
        path: characterState.assetsPath + animationStore.getState().animation,
        anchorX: 0.5,
        anchorY: 0.5,
        positionX: width / 2,
        positionY: 90,
        borderRadius: 2
    }, characterState)

    // STATE BARS
    const lifeBars = await createLifeBars(width, height);
    view.addChild(lifeBars);

    //BUTTON LABELS
    createButtonLabels(view);

    //CONTROLS
    petViewControl();

    return view;
}

