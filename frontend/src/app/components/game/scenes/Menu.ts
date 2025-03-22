import { GameObjects } from "phaser";
import { SCENES } from "../../../constants/scenes.const";

export class Menu extends Phaser.Scene {
    // constants
    width!: number;
    height!: number;
    iconsStr: string[] = [SCENES.LESSON, 'stats', 'forum', 'bots', 'missions', 'map']

    // game objects
    private icons: GameObjects.Image[] = [];
    private iconContainers: GameObjects.Container[] = [];

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
        this.add.rectangle(0,0, this.width, this.height, 0x18347a, 0.9)
            .setOrigin(0)
        const border = this.add.nineslice(
            this.width / 2,
            this.height / 2,
            'border',
            0,
            this.width - 10,
            this.height - 10,
            10, 10, 10, 10
        ).setOrigin(0.5, 0.5);

        // Creating and aligning menu buttons
        for (var key of this.iconsStr) {
            const container = this.createAppButton(key)

            this.iconContainers.push(container)
        }
        
        Phaser.Actions.GridAlign(this.iconContainers, {
            width: 4,
            height: 2,
            cellWidth: (this.width * 0.8) / 4,
            cellHeight: (this.height * 0.8) / 4,
            x: this.width * 0.2,
            y: this.height * 0.1,
            
        })
    }

    private createAppButton(key: string) {
        const container = this.add.container(0, 0)
        const button = this.add.image(0, 0, `icon-${key}`)
            .setScale(2)
        const label = this.add.text(0, button.getBottomCenter().y + 10, key,{
            fontSize: '12px',
            color: '#EFF3F3',
            align: 'center'
        })
        label.setOrigin(0.5, 0)

            
        button.setInteractive({useHandCursor: true})
            .on('pointerover', () => {
                // console.log(key)
                button.setTint(0xaaaaaa)
                label.setTint(0xaaaaaa)
            })
            .on('pointerout', () => {
                button.clearTint()
                label.clearTint()
            })
            .on('pointerup', () => {
                if (key == 'forum') {
                    window.open('/forum', '_blank')
                } else {
                    this.scene.start(key)
                }
            })
        
        this.icons.push(button)
        container.add([button, label])
        return container;
    }
}