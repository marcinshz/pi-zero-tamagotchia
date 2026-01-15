import {Assets, Container, Graphics, Sprite} from "pixi.js";
import {SupabaseClient} from "@supabase/supabase-js";

type EmotionProps = {
    key: string;
    positionX: number;
    positionY: number;
    iconPath: string;
};

function sendMessage(iconPath: string, db: SupabaseClient) {
    if (db) {
        db.from('messages').insert({
            recipient: 1,
            emotion: iconPath,
            seen: false
        }).then(res => {
            console.log(res)
        })
    }
}

export async function Emotion(
    view: Container,
    props: EmotionProps,
    db: SupabaseClient,
) {
    const {key, positionX, positionY, iconPath} = props;

    const container = new Container();
    container.position.set(positionX, positionY);
    view.addChild(container);

    const bgAsset = await Assets.load('assets/emotions/emotionBG.png');
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

    // overlay "charge"
    const overlay = new Graphics();
    overlay.rect(-40, 10, 80, 80);
    overlay.fill("#000");
    overlay.alpha = 0;
    container.addChild(overlay);

    let holding = false;
    let startTime = 0;
    const HOLD_TIME = 1000;

    function animate() {
        if (!holding) return;

        const t = performance.now() - startTime;
        const progress = Math.min(t / HOLD_TIME, 1);
        overlay.alpha = progress * 0.6;

        if (progress === 1) {
            holding = false;
            overlay.alpha = 0;
            sendMessage(iconPath, db);
            return;
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener("keydown", (e) => {
        if (e.code !== key || holding) return;
        holding = true;
        startTime = performance.now();
        requestAnimationFrame(animate);
    });

    window.addEventListener("keyup", (e) => {
        if (e.code !== key) return;
        holding = false;
        overlay.alpha = 0;
    });
}
