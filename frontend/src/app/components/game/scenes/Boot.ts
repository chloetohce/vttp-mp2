import { Store } from "@ngrx/store";
import { selectStage } from "../../../store/player/player.store";
import { firstValueFrom, map, take } from "rxjs";
import { AppState } from "../../../store/app.store";
import { SCENES } from "../../../constants/scenes.const";

export class Boot extends Phaser.Scene {
    private store!: Store<AppState>

    constructor() {
        super({
            key: SCENES.BOOT
        })

    }

    init() {
        this.store = this.registry.get('store');
    }
    
    preload() {
        // this.load.plugin('rexanchorplugin', 
        //     'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexanchorplugin.min.js', 
        //     true);

    }
        
    async create() {
        let stage = await firstValueFrom(this.store.select(selectStage)
            .pipe(take(1)))
        
        if (stage == 0) {
            this.scene.start(SCENES.EDITOR)
        } else {
            this.scene.start(SCENES.MENU)
        }

        
    }
}