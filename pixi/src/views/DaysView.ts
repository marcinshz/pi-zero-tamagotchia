import {Container, Text} from "pixi.js";

export function DaysView(width: number, height: number): Container {
    const view = new Container();
    
    const view3Text = new Text({
        text: "DaysView",
        style: {
            fontFamily: "Arial",
            fontSize: 24,
            fill: 0x00ff00,
            align: "center"
        }
    });
    
    view3Text.anchor.set(0.5);
    view3Text.position.set(width / 2, height / 2);
    view.addChild(view3Text);
    
    return view;
}

