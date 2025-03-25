import { GameObjects } from "phaser";
import { SCENES } from "../../../constants/scenes.const";
import { Store } from "@ngrx/store";
import { AppState } from "../../../store/app.store";
import { restart } from "../../../store/player/player.action";

export class GameOver extends Phaser.Scene {
    private width!: number;
    private height!: number;
    private username!: string

    private store!: Store<AppState>
    
    private btnRestart!: GameObjects.Image;
    private btnRestartText!: GameObjects.Text;

    constructor() {
        super(SCENES.GAMEOVER)
    }

    init() {
        this.width = this.game.renderer.width;
        this.height = this.game.renderer.height;
        this.store = this.game.registry.get('store')
        this.username = this.game.registry.get('username')
    }

    preload() {
        this.load.image('btn-red', '/phaser/misc/red-btn.png')
    }

    create() {
        this.add.rectangle(0, 0, this.width, this.height, 0x121212, 0.5)
            .setOrigin(0)

        const main = this.add.text(
            (this.width + 50)/2, this.height/2,
            "Game Over", 
            {
                fontSize: '30px',
                align: 'center',
                fontStyle: 'bold'
            }
        )
        .setOrigin(0.5)

        this.add.text(
            (this.width + 50)/2, main.getBottomCenter().y + 30,
            'You lost all your health...',
            {
                fontSize: '18px',
                fontStyle: 'italic',
                align: 'center'
            }
        )
        .setOrigin(0.5)

        this.btnRestart = this.add.image(
            (this.width + 50)/2, this.height * 0.8,
            'btn-red'
        )

        this.btnRestartText = this.add.text(
            this.btnRestart.getCenter().x, this.btnRestart.getCenter().y + 1,
            "Restart", 
            {
                align: 'center'
            }
        )
        .setOrigin(0.5)

        this.btnRestart.setInteractive({useHandCursor: true})
            .on('pointerover', () => {
                this.btnRestart.setTint(0xaaaaaa)
                this.btnRestartText.setTint(0xaaaaaa)
            })
            .on('pointerout', () => {
                this.btnRestart.clearTint();
                this.btnRestartText.clearTint();
            })
            .on('pointerup', () => {
                this.store.dispatch(restart({username: this.username}))
                
                this.scene.start(SCENES.BOOT)
            })
    }
}