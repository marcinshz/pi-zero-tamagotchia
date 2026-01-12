import {Container, Graphics, Sprite, Texture} from "pixi.js";
import {Animations, animationStore} from "../../states/AnimationState.ts";
import {CharacterState} from "../../states/types.ts";
import {lifeStore} from "../../states/LifeState.ts";

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
}

export async function createVideo(props: CreateVideoProps, characterState: CharacterState) {
    const {view, path, width, height, anchorX, anchorY, positionX, positionY, borderRadius = 0} = props;
    const video = document.createElement("video");
    video.src = path;
    video.loop = false
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "auto";
    await new Promise<void>((resolve, reject) => {
        video.addEventListener("canplaythrough", async () => {
            try {
                await video.play();
                resolve();
            } catch (error) {
                console.error("Video play error:", error);
                reject(error);
            }
        }, {once: true});
        video.load();
    });

    animationStore.subscribe(async (state) => {
        if (!state.isPlaying) {
            video.src = characterState.assetsPath + state.animation;
            await new Promise<void>((resolve, reject) => {
                video.addEventListener("canplaythrough", async () => {
                    try {
                        await video.play();
                        resolve();
                    } catch (error) {
                        console.error("Video play error:", error);
                        reject(error);
                    }
                }, {once: true});
            });
        }
    })

    video.addEventListener('ended', () => {
        animationStore.getState().animationEnd();
        animationStore.getState().animationChange(animationStore.getState().nextAnimation);
        animationStore.getState().setNextAnimation(Animations.IDLE);
    })

    video.addEventListener('play', () => {
        animationStore.getState().animationPlay();
        lifeStore.getState().actionPending?.();
        lifeStore.getState().setActionPending(undefined);
        lifeStore.getState().setActionPendingName(undefined);
    })

    const texture = Texture.from(video);
    const sprite = new Sprite(texture);
    sprite.width = width;
    sprite.height = height;
    sprite.anchor.set(anchorX, anchorY);
    sprite.position.set(positionX, positionY);

    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawRoundedRect(positionX - width * anchorX, positionY - height * anchorY, width, height, borderRadius);
    mask.endFill();

    view.addChild(sprite);
    view.addChild(mask);
    sprite.mask = mask;
}