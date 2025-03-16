import { inject } from "@angular/core";
import { Store } from "@ngrx/store";

export class Tutorial extends Phaser.Scene {

    constructor() {
        super('tutorial');
    }

    preload() {
        this.load.image('border', '/assets/phaser/border.png');
    }

    create() {
        const width = this.game.renderer.width;
        const height = this.game.renderer.height;

        // Getting anchor plugin
        const anchor = (this.plugins.get('rexanchorplugin') as any)
        
        const border = this.add.nineslice(
            width / 2,
            height / 2,
            'border',
            0,
            width - 10,
            height - 10,
            10, 10, 10, 10
        ).setOrigin(0.5, 0.5);

        anchor.add(border, {
            centerX: 'center',
            centerY: 'center'
        })

        this.scale.on('resize', (gameSize: any) => {
            let w = gameSize.width;
            let h = gameSize.height;
            border.setSize(w, h);
        });

        this.scene.launch('dialogue')

    }
}