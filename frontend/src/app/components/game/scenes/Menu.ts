import { GameObjects } from "phaser";
import { SCENES } from "../../../constants/scenes.const";
import { AppState } from "../../../store/app.store";
import { Store } from "@ngrx/store";
import { PlayerState, selectPlayerState } from "../../../store/player/player.store";
import { endDay } from "../../../store/player/player.action";

export class Menu extends Phaser.Scene {
    // constants
    width!: number;
    height!: number;
    iconsStr: string[] = [SCENES.LESSON, 'stats', 'inventory', 'bots', 'missions', 'map']

    // game objects
    private icons: GameObjects.Image[] = [];
    private iconContainers: GameObjects.Container[] = [];
    private statusBar!: GameObjects.Rectangle;
    private hp!: GameObjects.Text;
    private energy!: GameObjects.Text;
    private day!: GameObjects.Text;
    private endDay!: GameObjects.Text;

    // utils
    private store!: Store<AppState>

    constructor() {
        super(SCENES.MENU)
    }

    init() {
        this.width = this.game.renderer.width;
        this.height = this.game.renderer.height;
        this.store = this.game.registry.get('store');
    }

    preload() {
        this.load.setPath('/phaser')
        this.load.image('border', 'border.png');
        this.load.image('icon-health', 'icons/health.png')
        this.load.image('icon-energy', 'icons/energy.png')

        for (var key of this.iconsStr) {
            this.load.image(`icon-${key}`, `icons/${key}.png`)
        }
    }

    create() {
        this.add.rectangle(0,0, this.width, this.height, 0x152C65, 0.9)
            .setOrigin(0)

        // Status bar
        this.statusBar = this.add.rectangle(
            5,5,
            this.width - 10, this.height*0.04,
            0x111812, 0.9
        )
        .setOrigin(0)
        this.add.arc(
            this.width/2, this.height * 0.04, 50, 180, 360, true, 0x111812, 0.9
        )
        .setOrigin(0.5)
        this.add.image(this.width * 0.05, this.statusBar.getLeftCenter().y, 'icon-health')
        this.add.image(this.statusBar.getRightCenter().x - this.width * 0.05, this.statusBar.getRightCenter().y, 'icon-energy')
        this.add.text(
            this.width/2, this.statusBar.getCenter().y,
            "DAY",
            {
                fontSize: '20px',
                fontStyle: 'bold'
            }
        )
        .setOrigin(0.5)
        this.hp = this.add.text(
            this.width * 0.05 + 32, this.statusBar.getCenter().y,
            "10"
        )
        .setOrigin(0.5)
        this.energy = this.add.text(
            this.statusBar.getRightCenter().x - this.width * 0.05 - 32, this.statusBar.getCenter().y,
            "10"
        )
        .setOrigin(0.5)
        this.day = this.add.text(
            this.width / 2, this.statusBar.getCenter().y + this.height * 0.03, 
            "0", 
            {
                fontSize: '20px'
            }
        )
        .setOrigin(0.5)

        const border = this.add.nineslice(
            this.width / 2,
            this.height / 2,
            'border',
            0,
            this.width - 5,
            this.height - 5,
            10, 10, 10, 10
        ).setOrigin(0.5, 0.5);

        this.endDay = this.add.text(
            this.width * 0.85, this.height *0.07,
            'End Day',
            {
                backgroundColor:"#111812",
                padding: {x: 4, y: 6},
            }
        ).setAlpha(0.9)
        this.endDay.setInteractive({useHandCursor: true})
            .on('pointerover', () => {
                this.endDay.setTint(0xaaaaaa)
            })
            .on('pointerout', () => {
                this.endDay.clearTint()
            })
            .on('pointerup', () => {
                this.scene.start(SCENES.ENDDAY)
            })

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
            y: this.height * 0.2,
            
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
                    this.scene.start(key)
            })
        
        this.icons.push(button)
        container.add([button, label])
        return container;
    }

    override update(time: number, delta: number): void {
        let gameState: PlayerState;
        this.store.select(selectPlayerState)
            .subscribe(state => gameState = state)
            .unsubscribe()
        this.day.setText(gameState!.day.toString())
        this.hp.setText(gameState!.hp.toString())
        this.energy.setText(gameState!.energy.toString())
    }
}