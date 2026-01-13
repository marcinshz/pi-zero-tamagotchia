import {Assets, Container, Sprite} from "pixi.js";

export type EmotionProps = {
    positionX: number,
    positionY: number,
    iconPath: string,
}

export async function Emotion(view: Container<any>, props: EmotionProps) {
    const {positionX, positionY, iconPath} = props;

    //EVENT BG
    const bgAsset = await Assets.load('assets/emotions/emotionBG.png');
    const bgSprite = new Sprite(bgAsset);
    bgSprite.width = 100;
    bgSprite.height = 100;
    bgSprite.anchor.set(0.5, 0);
    bgSprite.position.set(positionX, positionY);
    view.addChild(bgSprite);

    //EVENT ICON
    const iconAsset = await Assets.load(iconPath);
    const iconSprite = new Sprite(iconAsset);
    iconSprite.width = 50;
    iconSprite.height = 50;
    iconSprite.anchor.set(0.5, 0);
    iconSprite.position.set(positionX, positionY+25);
    view.addChild(iconSprite);
}