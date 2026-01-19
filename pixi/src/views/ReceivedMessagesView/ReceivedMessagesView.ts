import {Assets, Container, Graphics, Sprite} from "pixi.js";
import {EmotionReceived} from "./EmotionReceived.ts";
import {db} from "../../db.ts";

export async function ReceivedMessagesView() {
    const view = new Container();
    const userId = localStorage.getItem('userId');

    const background = new Graphics();
    background.rect(0, 0, 320, 240);
    background.fill("#d8e2c3");
    view.addChild(background);

    const envelopeAsset = await Assets.load('assets/envelope.png');
    const envelopeSprite = new Sprite(envelopeAsset);
    envelopeSprite.width = 72;
    envelopeSprite.height = 72;
    envelopeSprite.anchor.set(0.5, 0);
    envelopeSprite.position.set(160, 16);
    view.addChild(envelopeSprite);

    if(db){
        const receivedMessages = await db
            .from('messages')
            .select('emotion, id')
            .eq('recipient', userId)
        if (receivedMessages.data) {
            showMessagesSequentially(view, receivedMessages.data);
        }

        db.channel('messages-realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `recipient=eq.${userId}`
                },
                async payload => {
                    const newMessage = payload.new as { emotion: string; id: number };

                    EmotionReceived({...newMessage}).then(sprite => {
                        view.addChild(sprite);
                    });
                }
            )
            .subscribe();
    }

    return view;
}

async function showMessagesSequentially(view: Container, messages: {
    emotion: string,
    id: number
}[]) {
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];

        const emotionReceived = await EmotionReceived(message);
        view.addChild(emotionReceived);

        await sleep(1000);

        if (i !== messages.length - 1) {
            view.removeChild(emotionReceived);
        }
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
