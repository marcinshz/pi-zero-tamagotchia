import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { LifeState, lifeStore } from "../../states/LifeState.ts";

export async function createLifeBars(): Promise<Container> {
  const container = new Container();

  const margin = 20;
  const gap = 20;
  const barWidth = (320 - 2 * margin - 2 * gap) / 3;
  const barHeight = 14;
  const bottomPadding = 10;
  const iconHeight = 24;

  const icons = ["assets/smile.png", "assets/heart.png", "assets/cherry.png"];
  const sectionTop = 240 - bottomPadding - barHeight - iconHeight - 2 - 8;
  const sectionHeight = 240 - sectionTop;

  const contentHeight = iconHeight + barHeight;
  const sectionCenter = sectionTop + sectionHeight / 2;
  const labelY = sectionCenter - contentHeight / 2;
  const barY = labelY + iconHeight + 2;

  // Background
  const background = new Graphics();
  background.rect(0, sectionTop, 320, sectionHeight);
  background.fill("#b3c799");
  background.rect(0, sectionTop, 320, 1.5).fill(0x000000);
  container.addChild(background);

  const barFills: Graphics[] = [];

  await Promise.all(
    icons.map(async (icon, index) => {
      const x = margin + index * (barWidth + gap);

      const barContainer = new Container();
      barContainer.position.set(x, 0);

      const iconTexture = await Assets.load(icon);
      const iconSprite = new Sprite(iconTexture);
      iconSprite.width = 20;
      iconSprite.height = 20;
      iconSprite.anchor.set(0.5, 0);
      iconSprite.position.set(barWidth / 2, labelY);
      barContainer.addChild(iconSprite);

      const barBg = new Graphics();
      barBg.rect(0, barY, barWidth, barHeight);
      barBg.fill(0x2a2a2a);
      barBg.stroke({ width: 1, color: 0x000000 });
      barContainer.addChild(barBg);

      const barFill = new Graphics();
      barContainer.addChild(barFill);
      barFills[index] = barFill;

      container.addChild(barContainer);
    }),
  );

  function render(state: LifeState) {
    const values = [state.fun, state.love, state.food];

    values.forEach((value, i) => {
      const fill = barFills[i];
      if (!fill) return;

      const fillWidth = (barWidth - 2) * (value / 100);
      fill.clear();
      fill.rect(1, barY + 1, fillWidth, barHeight - 2);
      fill.fill("#ede6d5");
    });
  }

  render(lifeStore.getState());
  lifeStore.subscribe(render);

  return container;
}
