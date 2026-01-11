import {Container, Text} from "pixi.js";

export function PetView(width: number, height: number): Container {
    const view = new Container();
    
    const helloText = new Text({
        text: "PetView",
        style: {
            fontFamily: "Arial",
            fontSize: 24,
            fill: 0x000000,
            align: "center"
        }
    });
    
    helloText.anchor.set(0.5);
    helloText.position.set(width / 2, height / 2);
    view.addChild(helloText);
    
    return view;
}

