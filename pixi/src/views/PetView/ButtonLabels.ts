import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { lifeStore } from "../../states/LifeState.ts";

export function createColoredContainer(
  x: number,
  y: number,
  width: number,
  height: number,
  textStr: string,
) {
  const container = new Container();
  container.position.set(x, y);

  const bg = new Graphics();
  bg.beginFill("#283618");
  bg.drawRoundedRect(0, 0, width, height, 5);
  bg.endFill();
  container.addChild(bg);

  let interval: ReturnType<typeof setInterval> | undefined;

  lifeStore.subscribe((state) => {
    if (state.actionPendingName === textStr) {
      if (!interval) {
        interval = setInterval(() => {
          bg.alpha = bg.alpha === 1 ? 0.7 : 1;
        }, 500);
      }
    } else {
      if (interval) {
        clearInterval(interval);
        interval = undefined;
        bg.alpha = 1;
      }
    }
  });

  const text = new Text(
    textStr,
    new TextStyle({
      fontFamily: "monospace",
      fontSize: 11,
      fill: "#fff",
      align: "center",
    }),
  );
  text.anchor.set(0.5); // wycentrowanie
  text.x = width / 2;
  text.y = height / 2;
  container.addChild(text);

  return container;
}

export function createButtonLabels(view: Container) {
  const kissContainer = createColoredContainer(8, 24, 40, 20, "KISS");
  const feedContainer = createColoredContainer(8, 140, 40, 20, "FEED");
  const playContainer = createColoredContainer(272, 24, 40, 20, "PLAY");
  const viewContainer = createColoredContainer(272, 140, 40, 20, "VIEW");

  view.addChild(kissContainer, feedContainer, playContainer, viewContainer);
}
