import {Container, Text} from "pixi.js";

export function CommunicationView(width: number, height: number): Container {
    const view = new Container();
    
    const view2Text = new Text({
        text: "CommunicationView",
        style: {
            fontFamily: "Arial",
            fontSize: 24,
            fill: 0x0000ff,
            align: "center"
        }
    });
    
    view2Text.anchor.set(0.5);
    view2Text.position.set(width / 2, height / 2);
    view.addChild(view2Text);
    
    return view;
}

