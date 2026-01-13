import {Container, Graphics} from "pixi.js";

export function ReceivedMessagesView() {
    const view = new Container();

    //BG
    const background = new Graphics();
    background.rect(0, 0, 320, 240);
    background.fill("#d8e2c3");
    view.addChild(background);

    return view;
}