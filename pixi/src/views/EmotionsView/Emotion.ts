import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { registerEmotion } from "./controls.ts";
import { emotionStore } from "../../states/EmotionState.ts";

type EmotionProps = {
  key: string;
  positionX: number;
  positionY: number;
  iconPath: string;
};

export async function Emotion(view: Container, props: EmotionProps) {
  const { key, positionX, positionY, iconPath } = props;

  registerEmotion(key, iconPath);

  const container = new Container();
  container.position.set(positionX, positionY);
  view.addChild(container);

  const bgAsset = await Assets.load("assets/emotions/emotionBG.png");
  const bgSprite = new Sprite(bgAsset);
  bgSprite.width = 100;
  bgSprite.height = 100;
  bgSprite.anchor.set(0.5, 0);
  container.addChild(bgSprite);

  const iconAsset = await Assets.load(iconPath);
  const iconSprite = new Sprite(iconAsset);
  iconSprite.width = 50;
  iconSprite.height = 50;
  iconSprite.anchor.set(0.5, 0);
  iconSprite.position.set(0, 25);
  container.addChild(iconSprite);

  const overlay = new Graphics();
  overlay.rect(-40, 10, 80, 80);
  overlay.fill(0x3cb371);
  overlay.alpha = 0;
  container.addChild(overlay);

  emotionStore.subscribe((state) => {
    if (state.animatedEmoji === key) {
      overlay.alpha = state.holdProgress * 0.6;
    } else {
      overlay.alpha = 0;
    }
  });
}
