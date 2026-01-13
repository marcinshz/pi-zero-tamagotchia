import {CalendarEvent} from "../../states/EventsState.ts";
import {Assets, Container, Sprite, Text} from "pixi.js";

export async function RenderEvent(event:CalendarEvent, view:Container, index:number){
    //EVENT BG
    const iconTexture = await Assets.load('assets/event_label.png');
    const iconSprite = new Sprite(iconTexture);
    iconSprite.width = 240;
    iconSprite.height = 80;
    iconSprite.anchor.set(0.5, 0);
    iconSprite.position.set(320/2, 70 + index * 70);
    view.addChild(iconSprite);
    const date = new Date(event.date);
    const dateString = `${date.getDate()}/${date.getMonth() + 1}`;

    const daysViewText = new Text({
        text: dateString + ' ' + event.name,
        style: {
            fontFamily: "monospace",
            fontSize: 16,
            fill: "#000",
            align: "center",
        }
    });
    daysViewText.anchor.set(0.5);
    daysViewText.position.set(0,52);
    iconSprite.addChild(daysViewText);
}