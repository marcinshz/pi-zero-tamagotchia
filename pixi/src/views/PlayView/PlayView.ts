/* eslint-disable @typescript-eslint/no-this-alias */
import {Assets, Container, Graphics, Sprite, Text} from "pixi.js";
import {createColoredContainer} from "../PetView/ButtonLabels.ts";
import {lifeStore} from "../../states/LifeState.ts";

let playViewInstance: PlayViewClass | null = null;
const assetsPath = localStorage.getItem("assetsPath");

export class PlayViewClass {
    public view: Container;
    public started = false;

    private player = {
        x: 32,
        y: 0,
        vy: 0,
        jumps: 0,
        width: 20,
        height: 32,
        alive: true,
    };
    private obstacles: Graphics[] = [];

    private gravity = 1.2;
    private jumpForce = 14;
    private doubleJumpForce = 10;
    private baseSpeed = 3;
    private currentSpeed = this.baseSpeed;
    private maxSpeed = 12;
    private speedIncreasePerSecond = 0.08;

    private spawnTimer = 0;
    private nextSpawnInterval = 100;
    private minSpawnInterval = 50;
    private maxSpawnInterval = 120;

    private character!: Sprite;
    private gameContainer!: Container;

    private lastTime = performance.now();
    private totalElapsedTime = 0;
    private softStartTime = 3;

    private score = 0;
    private scoreText!: Text;
    private recordText!: Text;

    constructor() {
        this.view = new Container();
        playViewInstance = this;
        this.init();
    }

    private async init() {
        const WIDTH = 320;
        const HEIGHT = 240;
        const SCALE = 1.5;

        this.view.removeChildren();

        const background = new Graphics();
        background.beginFill(0xd8e2c3);
        background.drawRect(0, 0, WIDTH, HEIGHT);
        background.endFill();
        this.view.addChild(background);

        const startLabel = createColoredContainer(8, 24, 40, 20, "PLAY");
        this.view.addChild(startLabel);

        const backLabel = createColoredContainer(272, 24, 40, 20, "BACK");
        this.view.addChild(backLabel);

        this.scoreText = new Text("Score: 0", {fill: 0x000000, fontSize: 10, fontFamily: 'monospace'});
        this.scoreText.position.set(8, 6);
        this.view.addChild(this.scoreText);

        this.recordText = new Text(`Record: ${lifeStore.getState().gameRecord}`, {
            fill: 0x000000,
            fontSize: 10,
            fontFamily: 'monospace'
        });
        this.recordText.position.set(236, 6);
        this.view.addChild(this.recordText);

        this.gameContainer = new Container();
        this.gameContainer.y = HEIGHT;
        this.gameContainer.scale.set(SCALE);
        this.view.addChild(this.gameContainer);

        const characterTexture = await Assets.load(assetsPath + "/gameCharacter.png");
        const characterSprite = new Sprite(characterTexture);
        characterSprite.width = 20;
        characterSprite.height = 32;
        characterSprite.position.set(0, 0);
        this.character = characterSprite;
        this.drawPlayer();
        this.gameContainer.addChild(this.character);

        this.spawnObstacle();
        requestAnimationFrame(this.gameLoop);
    }

/*    private drawPlayerYellow() {
        this.character.clear();
        this.character.beginFill(0xffff00);
        this.character.drawRect(0, 0, this.player.width, this.player.height);
        this.character.endFill();
    }*/
    private drawPlayer(){

    }

    private spawnObstacle() {
        const WIDTH_SCALED = 320 / 1.5;
        const minH = 24;
        const maxH = Math.min(64, 32 + this.currentSpeed * 4);
        const h = Math.floor(Math.random() * (maxH - minH + 1)) + minH;

        const obs = new Graphics();
        obs.beginFill("#6a5fa0");
        obs.drawRect(0, 0, 10, h);
        obs.endFill();
        obs.x = WIDTH_SCALED;
        obs.y = -h;
        this.gameContainer.addChild(obs);
        this.obstacles.push(obs);
    }

    public jump() {
        if (!this.started || !this.player.alive) return;
        if (this.player.jumps < 2) {
            const dynJump = this.jumpForce + this.currentSpeed * 0.1;
            const dynDouble = this.doubleJumpForce + this.currentSpeed * 0.05;
            this.player.vy = this.player.jumps === 0 ? dynJump : dynDouble;
            this.player.jumps++;
        }
    }

    public startOrRestart() {
        if (!this.started) {
            this.started = true;
        } else if (!this.player.alive) {
            this.reset();
            this.started = true;
        }
    }

    public reset() {
        this.player.y = 0;
        this.player.vy = 0;
        this.player.jumps = 0;
        this.player.alive = true;

        this.obstacles.forEach((obs) => obs.destroy());
        this.obstacles = [];

        this.currentSpeed = this.baseSpeed;
        this.spawnTimer = 0;
        this.nextSpawnInterval = 100;
        this.totalElapsedTime = 0;

        this.score = 0;
        this.scoreText.text = "Score: 0";
        this.recordText.text = "Record: " + lifeStore.getState().gameRecord;

        this.drawPlayer();
        this.spawnObstacle();
    }

    private updatePhysics(dt: number) {
        if (!this.started || !this.player.alive) return;

        this.player.vy -= this.gravity * dt * 60;
        this.player.y += this.player.vy * dt * 60;

        if (this.player.y < 0) {
            this.player.y = 0;
            this.player.vy = 0;
            this.player.jumps = 0;
        }

        this.character.x = Math.round(this.player.x);
        this.character.y = Math.round(-this.player.height - this.player.y);
    }

    private updateObstacles(dt: number) {
        if (!this.started) return;

        for (const obs of this.obstacles) {
            obs.x -= this.currentSpeed * dt * 60;
        }

        this.obstacles = this.obstacles.filter((obs) => {
            if (obs.x + 10 < 0) {
                this.gameContainer.removeChild(obs);
                obs.destroy();
                return false;
            }
            return true;
        });
    }

    private updateSpawn(dt: number) {
        if (!this.started) return;

        this.spawnTimer += dt * 60;
        if (this.spawnTimer >= this.nextSpawnInterval) {
            this.spawnObstacle();
            this.spawnTimer = 0;

            const speedFactor = this.currentSpeed / this.baseSpeed;
            const minInt = Math.max(
                this.minSpawnInterval,
                this.minSpawnInterval / speedFactor,
            );
            const maxInt = Math.max(
                this.maxSpawnInterval,
                this.maxSpawnInterval / speedFactor,
            );

            this.nextSpawnInterval =
                Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
        }
    }

    private checkCollision(): boolean {
        if (!this.started) return false;

        for (const obs of this.obstacles) {
            const playerLeft = this.player.x;
            const playerRight = this.player.x + this.player.width;
            const playerTop = -this.player.y - this.player.height;
            const playerBottom = -this.player.y;

            const obsLeft = obs.x;
            const obsRight = obs.x + 10;
            const obsTop = obs.y;
            const obsBottom = obs.y + obs.height;

            if (
                playerRight > obsLeft &&
                playerLeft < obsRight &&
                playerBottom > obsTop &&
                playerTop < obsBottom
            )
                return true;
        }

        return false;
    }

    private killPlayer() {
        this.player.alive = false;

        const finalScore = Math.floor(this.score);
        if (finalScore > lifeStore.getState().gameRecord) {
            lifeStore.getState().setGameRecord(finalScore);
            this.recordText.text = "Record: " + finalScore;
        }

/*        this.character.clear();
        this.character.beginFill(0xff0000);
        this.character.drawRect(0, 0, this.player.width, this.player.height);
        this.character.endFill();*/
    }

    private gameLoop = (currentTime: number) => {
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (this.started && this.player.alive) {
            this.totalElapsedTime += dt;

            this.score += dt * 10;
            this.scoreText.text = "Score: " + Math.floor(this.score);

            if (this.totalElapsedTime > this.softStartTime) {
                this.currentSpeed += this.speedIncreasePerSecond * dt;
                if (this.currentSpeed > this.maxSpeed)
                    this.currentSpeed = this.maxSpeed;
            }

            this.updatePhysics(dt);
            this.updateObstacles(dt);
            this.updateSpawn(dt);

            if (this.checkCollision()) this.killPlayer();
        }

        requestAnimationFrame(this.gameLoop);
    };
}

export function PlayView(): Container {
    if (!playViewInstance) new PlayViewClass();
    return playViewInstance!.view;
}

export function getPlayViewInstance(): PlayViewClass | null {
    return playViewInstance;
}
