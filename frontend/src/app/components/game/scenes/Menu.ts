import { GameObjects } from "phaser";
import { SCENES } from "../../../constants/scenes.const";

export class Menu extends Phaser.Scene {
    // constants
    width!: number;
    height!: number;
    iconsStr: string[] = ['learn', 'stats', 'forum', 'bots', 'missions', 'map']

    // game objects
    private icons: GameObjects.Image[] = [];

    constructor() {
        super(SCENES.MENU)
    }

    init() {
        this.width = this.game.renderer.width;
        this.height = this.game.renderer.height;

    }

    preload() {
        this.load.setPath('/phaser')
        this.load.image('border', 'border.png');

        for (var key of this.iconsStr) {
            this.load.image(`icon-${key}`, `icons/${key}.png`)
        }
    }

    create() {
        const border = this.add.nineslice(
            this.width / 2,
            this.height / 2,
            'border',
            0,
            this.width - 10,
            this.height - 10,
            10, 10, 10, 10
        ).setOrigin(0.5, 0.5);

        for (var key of this.iconsStr) {
            const button = this.add.image(0, 0, `icon-${key}`)
            this.icons.push(button)

            button.setInteractive({useHandCursor: true})
                .on('pointerover', () => {
                    button.setTint(0xaaaaaa)
                })
                .on('pointerout', () => {
                    button.clearTint()
                })

        }
        
        Phaser.Actions.GridAlign(this.icons, {
            width: 4,
            height: 2,
            cellWidth: (this.width - 50) / 4,
            cellHeight: (this.height - 100) / 4,
            x: this.width * 0.1,
            y: this.height * 0.1,
            
        })
    }
}