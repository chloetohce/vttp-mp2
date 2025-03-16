import { GameObjects } from "phaser";
import { of } from "rxjs";

export class Dialogue extends Phaser.Scene {
    // window
    width!: number
    height!: number

    textBox!: GameObjects.Container;

    idx: number = 0;
    tempDialogue = [`dialogue ${this.idx}`, "dialogue 2", "dialogue 3"]
    currDialogue!: Phaser.GameObjects.Text;

    constructor() {
        super("dialogue");
    }

    init() {
        this.width = this.game.renderer.width;
        this.height = this.game.renderer.height;
    }

    create() {
        this.textBox = this.add.container(Math.floor(this.width * 0.6), 0)

        const background = new Phaser.GameObjects.Rectangle(this, 0, 0, this.width * 0.4, this.height)
            .setDepth(0)
            .setOrigin(0,0)
            .setFillStyle(0x000000, 0.2)
        background.setInteractive()
        this.textBox.add(background)

        // Interaction
        background.on('pointerdown', () => {
            if (this.idx < this.tempDialogue.length) {
                let bubbleY;
                if (this.currDialogue) {
                    bubbleY = this.currDialogue.getBottomLeft().y;
                } else {
                    bubbleY = 0;
                }

                const speech = this.createSpeechBubble(
                    `${this.tempDialogue.at(this.idx)} testing`,
                    10,
                    bubbleY + 10,
                    this.width * 0.4 - 2 * 10
                )

                this.textBox.add(speech)
                this.idx += 1
                this.currDialogue = speech;
            }

        })
    }


    private createSpeechBubble(text: string, x:number, y: number, w: number) {
        const speech = new Phaser.GameObjects.Text(this, x, y, text, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            padding: {x: 5, y: 5},
            resolution: 3
        })
        speech.setBackgroundColor('#232121')
        speech.setAlpha(0.75)
        speech.setWordWrapWidth(this.width - 10)
        speech.width = this.width - 10

        return speech;
    }
}