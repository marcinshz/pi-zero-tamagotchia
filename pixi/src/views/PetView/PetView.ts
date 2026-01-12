import {Container} from "pixi.js";
import {CharacterState} from "../../states/types.ts";
import {createLifeBars} from "./LifeBars.ts";
import {getLifeState} from "../../states/LifeState.ts";
import {createVideo} from "./Video.ts";
import {createButtonLabels} from "./ButtonLabels.ts";
import {createFrame} from "./Frame.ts";

export async function PetView(width: number, height: number, characterState: CharacterState): Promise<Container> {
    const lifeState = getLifeState();
    const view = new Container();

    // CHARACTER FRAME
    await createFrame(view, width);

    // VIDEO
    await createVideo({
        view,
        width: 128,
        height: 128,
        path: characterState.assetsPath + "/idle.mp4",
        anchorX: 0.5,
        anchorY: 0.5,
        positionX: width / 2,
        positionY: 90,
        borderRadius: 2
    })

    // STATE BARS
    const lifeBars = createLifeBars(width, height, lifeState);
    view.addChild(lifeBars);

    //BUTTON LABELS
    createButtonLabels(view);


    return view;
}

