import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { SCENES } from "../../../constants/scenes.const";
import { EventBus } from "../bootstrap/eventbus";
import { endDay, increaseStage } from "../../../store/player/player.action";

export class Tutorial extends Phaser.Scene {
    private store!: Store;

    constructor() {
        super('tutorial');
    }

    preload() {
        this.load.image('border', '/phaser/border.png');
        this.store = this.game.registry.get('store')
        this.load.image('bg-lab', '/phaser/bg/home.png')
    }

    create() {
        const width = this.game.renderer.width;
        const height = this.game.renderer.height;

        const bg = this.add.image(width/2, height/2, 'bg-lab')
            bg.setOrigin(0.5)
            .setScale(height / bg.height)
            .setAlpha(0.5)
            
        
        const border = this.add.nineslice(
            width / 2,
            height / 2,
            'border',
            0,
            width - 10,
            height - 10,
            10, 10, 10, 10
        ).setOrigin(0.5, 0.5);

        // anchor.add(border, {
        //     centerX: 'center',
        //     centerY: 'center'
        // })

        this.scale.on('resize', (gameSize: any) => {
            let w = gameSize.width;
            let h = gameSize.height;
            border.setSize(w, h);
        });

        let dialogue = this.scene.launch(SCENES.DIALOGUE, {key: 'tutorial', speaker: 'embra'})

        EventBus.on('dialogue-end', () => {
            this.store.dispatch(increaseStage({currStage: 0}))
            this.store.dispatch(endDay())
            this.scene.stop(SCENES.DIALOGUE)
            this.scene.start(SCENES.ENDDAY)
        })

        // border.setInteractive({useHandCursor: true})
        //     .on('pointerup', () => {
        //         this.scene.setVisible(!this.scene.isVisible('dialogue'), 'dialogue')
        //     })
    }

    override update(time: number, delta: number): void {
        
    }
}