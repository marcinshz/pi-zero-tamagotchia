import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { animationStore } from "../../states/AnimationState.ts";
import { lifeStore } from "../../states/LifeState.ts";
import { getIdleAnimation } from "./getIdleAnimation.ts";

type CreateVideoProps = {
  view: Container;
  path: string;
  width: number;
  height: number;
  anchorX: number;
  anchorY: number;
  positionX: number;
  positionY: number;
  borderRadius?: number;
};

export async function createVideo(props: CreateVideoProps, assetsPath: string) {
  const {
    view,
    width,
    height,
    anchorX,
    anchorY,
    positionX,
    positionY,
    borderRadius = 0,
  } = props;
  const video = document.createElement("video");
  video.src = assetsPath + animationStore.getState().animation;
  video.loop = false;
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = "auto";

  await new Promise<void>((resolve, reject) => {
    video.addEventListener(
      "canplaythrough",
      async () => {
        try {
          await video.play();
          resolve();
        } catch (error) {
          console.error("Video play error:", error);
          reject(error);
        }
      },
      { once: true },
    );
    video.load();
  });

  // Subskrypcja animationStore z możliwością odsubskrybowania
  const unsubscribe = animationStore.subscribe(async (state) => {
    if (!state.isPlaying) {
      video.src = assetsPath + state.animation;
      await new Promise<void>((resolve, reject) => {
        video.addEventListener(
          "canplaythrough",
          async () => {
            try {
              await video.play();
              resolve();
            } catch (error) {
              console.error("Video play error:", error);
              reject(error);
            }
          },
          { once: true },
        );
      });
    }
  });

  video.addEventListener("ended", () => {
    animationStore.getState().animationEnd();
    animationStore
      .getState()
      .animationChange(animationStore.getState().nextAnimation);
    animationStore.getState().setNextAnimation(getIdleAnimation());
  });

  video.addEventListener("play", () => {
    animationStore.getState().animationPlay();
    lifeStore.getState().actionPending?.();
    lifeStore.getState().setActionPending(undefined);
    lifeStore.getState().setActionPendingName(undefined);
  });

  const texture = Texture.from(video);
  const sprite = new Sprite(texture);
  sprite.width = width;
  sprite.height = height;
  sprite.anchor.set(anchorX, anchorY);
  sprite.position.set(positionX, positionY);

  const mask = new Graphics();
  mask.beginFill(0xffffff);
  mask.drawRoundedRect(
    positionX - width * anchorX,
    positionY - height * anchorY,
    width,
    height,
    borderRadius,
  );
  mask.endFill();

  view.addChild(sprite);
  view.addChild(mask);
  sprite.mask = mask;

  // Zwracamy funkcję cleanup, żeby móc odsubskrybować
  return () => {
    unsubscribe();
    video.pause();
    video.src = "";
    video.remove();
  };
}
