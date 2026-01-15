import {Assets, Container, Sprite} from "pixi.js";

export async function EmotionReceived(message: { id: number, emotion: string }) {
    const container = new Container();
    container.position.set(160, 96);

    const bgAsset = await Assets.load('assets/emotions/emotionBG.png');
    const bgSprite = new Sprite(bgAsset);
    bgSprite.width = 100;
    bgSprite.height = 100;
    bgSprite.anchor.set(0.5, 0);
    container.addChild(bgSprite);

    const iconAsset = await Assets.load(message.emotion);
    const iconSprite = new Sprite(iconAsset);
    iconSprite.width = 50;
    iconSprite.height = 50;
    iconSprite.anchor.set(0.5, 0);
    iconSprite.position.set(0, 25);
    container.addChild(iconSprite);

    return container;
}