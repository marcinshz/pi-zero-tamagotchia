import { Container, Graphics } from "pixi.js";
import { Emotion } from "./Emotion";

export async function EmotionsView(): Promise<Container> {
    const view = new Container();

    const emotions = [
        {key: "KeyQ", positionX: 110, positionY: 20, iconPath: 'assets/emotions/happy.png'},
        {key: "KeyE", positionX: 210, positionY: 20, iconPath: 'assets/emotions/heart.png'},
        {key: "KeyA", positionX: 110, positionY: 120, iconPath: 'assets/emotions/mixed.png'},
        {key: "KeyD", positionX: 210, positionY: 120, iconPath: 'assets/emotions/angry.png'},
    ];

    const background = new Graphics();
    background.rect(0, 0, 320, 240);
    background.fill("#d8e2c3");
    view.addChild(background);

    await Promise.all(emotions.map(e => Emotion(view, e)));

    return view;
}
