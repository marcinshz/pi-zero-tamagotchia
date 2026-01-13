import {Container, Graphics} from "pixi.js";
import {Emotion} from "../shared/Emotion.ts";

export function EmotionsView(): Container {
    const view = new Container();
    const emotions = [
        {
            positionX: 110,
            positionY: 20,
            iconPath: 'assets/emotions/happy.png'
        },
        {
            positionX: 210,
            positionY: 20,
            iconPath: 'assets/emotions/heart.png'
        },
        {
            positionX: 110,
            positionY: 120,
            iconPath: 'assets/emotions/mixed.png'

        },
        {
            positionX: 210,
            positionY: 120,
            iconPath: 'assets/emotions/angry.png'
        },
    ]

    //BG
    const background = new Graphics();
    background.rect(0, 0, 320, 240);
    background.fill("#d8e2c3");
    view.addChild(background);

    //EMOTIONS
    emotions.forEach(async (emotion) => {
        await Emotion(view, emotion);
    })
    
    return view;
}

