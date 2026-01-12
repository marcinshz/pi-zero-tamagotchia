import {Assets, Container, Sprite} from "pixi.js";

export async function createFrame(view: Container, width: number) {
    const frameTexture = await Assets.load('assets/frame.png');
    const frameSprite = new Sprite(frameTexture);
    frameSprite.width = 148;
    frameSprite.height = 148;
    frameSprite.anchor.set(0.5);
    frameSprite.position.set(width / 2, 90);
    view.addChild(frameSprite);
}