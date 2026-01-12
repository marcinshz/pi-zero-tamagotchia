import {Assets, Container, Graphics, Sprite} from "pixi.js";

export interface LifeState {
    love: number;
    food: number;
    fun: number;
}

export function createLifeBars(width: number, height: number, lifeState: LifeState): Container {
    const container = new Container();
    
    const margin = 20;
    const gap = 20;
    const barWidth = (width - (2 * margin) - (2 * gap)) / 3;
    const barHeight = 14;
    const bottomPadding = 10;
    const iconHeight = 24;
    
    const icons = ["assets/smile.png", "assets/heart.png", "assets/cherry.png"];
    const values = Object.values(lifeState);
    const sectionTop = height - bottomPadding - barHeight - iconHeight - 2 - 8;
    const sectionHeight = height - sectionTop;
    
    const contentHeight = iconHeight + barHeight;
    
    // Center the content vertically within the section
    const sectionCenter = sectionTop + sectionHeight / 2;
    const labelY = sectionCenter - contentHeight / 2;
    const barY = labelY + iconHeight + 2;
    
    // Add background for bars section
    const background = new Graphics();
    background.rect(0, sectionTop, width, sectionHeight);
    background.fill("#b3c799");
    background.rect(0, sectionTop, width, 1.5).fill(0x000000);
    container.addChild(background);
    
    icons.forEach(async (icon, index) => {
        const x = margin + index * (barWidth + gap);
        
        // BAR CONTAINER
        const barContainer = new Container();
        barContainer.position.set(x, 0);

        //BAR ICON
        const iconTexture = await Assets.load(icon);
        const iconSprite = new Sprite(iconTexture);
        iconSprite.width = 20;
        iconSprite.height = 20;
        iconSprite.anchor.set(0.5, 0);
        iconSprite.position.set(barWidth / 2, labelY);
        barContainer.addChild(iconSprite);
        
        // BAR BG
        const barBg = new Graphics();
        barBg.rect(0, barY, barWidth, barHeight);
        barBg.fill(0x2a2a2a);
        barBg.stroke({ width: 1, color: 0x000000 });
        barContainer.addChild(barBg);
        
        // BAR FILL
        const value = values[index];
        const barFill = new Graphics();
        const fillWidth = (barWidth - 2) * (value / 100);
        barFill.rect(1, barY + 1, fillWidth, barHeight - 2);
        barFill.fill('#ede6d5');
        barContainer.addChild(barFill);
        
        container.addChild(barContainer);
    });
    
    return container;
}

