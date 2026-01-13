import {Assets, Container, Graphics, Sprite} from "pixi.js";
import {getUpcomingEvents} from "../../states/EventsState.ts";
import {RenderEvent} from "./RenderEvent.ts";

export async function DaysView(): Promise<Container> {
    const view = new Container();
    const upcomingEvents = getUpcomingEvents();

    //BG
    const background = new Graphics();
    background.rect(0, 0, 320, 240);
    background.fill("#d8e2c3");
    view.addChild(background);

    //CALENDAR ICON
    const calendarIcon = await Assets.load('assets/calendar.png');
    const iconSprite = new Sprite(calendarIcon);
    iconSprite.width = 52;
    iconSprite.height = 52;
    iconSprite.anchor.set(0.5, 0);
    iconSprite.position.set(160, 16);
    view.addChild(iconSprite);

    upcomingEvents.forEach((event, index) => {
        RenderEvent(event, view, index);
    })

    return view;
}

