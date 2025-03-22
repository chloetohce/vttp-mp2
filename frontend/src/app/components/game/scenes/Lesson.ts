import { Circle } from "phaser3-rex-plugins/plugins/gameobjects/shape/shapes/geoms";
import { SCENES, STAGES } from "../../../constants/scenes.const";

export class Lesson extends Phaser.Scene {
    private width!: number;
    private height!: number;

    // Game objects
    private lessonsContainer!: Phaser.GameObjects.Container;
    private lessonsArr: Phaser.GameObjects.Text[] = []

    constructor() {
        super(SCENES.LESSON)
    }

    init() {
        this.width = this.game.renderer.width;
        this.height = this.game.renderer.height;
    }

    preload() {
        this.load.image('kade-background', '/phaser/kade_background.png')
        this.load.image('kade-icon', '/phaser/icons/kade.png')
    }

    create() {
        this.add.rectangle(0,0, this.width, this.height, 0x313638, 0.9)
            .setOrigin(0)

        this.add.tileSprite(
            0, 0,
            this.width, 64,
            'kade-background'
        )
            .setOrigin(0)

        this.add.circle(this.width * 0.1, 64, 35)
            .setFillStyle(0xEAFDF8)
        this.add.image(this.width * 0.1, 64, 'kade-icon')
            .setScale(0.5)
        
        this.add.text(this.width / 2, 64 * 0.5, "Let's learn with Kade!", {
            fontSize: '24px',
            fontStyle: 'bold',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                stroke: true,
                fill: true
            }
        })
            .setOrigin(0.5)
        

        STAGES.forEach((lesson, i) => this.lessonsArr.push(this.createLessonButton(lesson, i)))

        Phaser.Actions.GridAlign(this.lessonsArr, {
            width: 1,
            height: this.lessonsArr.length,
            cellWidth: (this.width * 0.8),
            cellHeight: this.height * 0.05,
            x: this.width * 0.2,
            y: this.height * 0.1,
            
        })

        // this.scene.start(SCENES.EDITOR)
    }

    private createLessonButton(name: string, stage: number) {
        const lesson = this.add.text(0, 0, name)
            .setDepth(100)
        lesson.setInteractive({useHandCursor: true})
                .on('pointerup', () => {
                    this.scene.start(SCENES.EDITOR, {stage})
                })
                .on('pointerover', () => {
                    lesson.setTint(0xaaaaaa)
                })
                .on('pointerout', () => {
                    lesson.clearTint();
                })
        return lesson;
    }

}