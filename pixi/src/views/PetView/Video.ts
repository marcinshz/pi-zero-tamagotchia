import {Container, Graphics, Sprite, Texture} from "pixi.js";

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

export async function createVideo(props: CreateVideoProps) {
    const {view, path, width, height, anchorX, anchorY, positionX, positionY, borderRadius = 0} = props;
    const video = document.createElement("video");
    video.src = path;
    video.loop = true;
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

        // Start loading
        video.load();
    });
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