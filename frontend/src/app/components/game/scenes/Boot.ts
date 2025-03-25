import { Store } from "@ngrx/store";
import { selectLoading, selectStage } from "../../../store/player/player.store";
import { filter, firstValueFrom, map, take, tap } from "rxjs";
import { AppState } from "../../../store/app.store";
import { SCENES } from "../../../constants/scenes.const";
import { getPlayerData } from "../../../store/player/player.action";

export class Boot extends Phaser.Scene {
  private store!: Store<AppState>;

  private stage!: number;
  private username!: string;

  constructor() {
    super({
      key: SCENES.BOOT,
    });
  }

  init() {
    this.store = this.registry.get('store');
    this.username = this.game.registry.get('username');
    this.stage = this.game.registry.get('stage')
  }

  preload() {
    // this.load.plugin('rexanchorplugin',
    //     'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexanchorplugin.min.js',
    //     true);
    // this.store.dispatch(getPlayerData())
  }

  async create() {


    const loading = await firstValueFrom(
        this.store.select(selectLoading).pipe(
            filter(loading => !loading), 
            take(1) 
        )
    );

    console.log(loading)

    this.stage = await firstValueFrom(
        this.store.select(selectStage).pipe(
            filter(stage => stage !== undefined), 
            take(1) 
        )
    );

    // Start the appropriate scene based on the stage
    if (this.stage === 0) {
        this.scene.start(SCENES.TUTORIAL);
    } else {
        this.scene.start(SCENES.MENU);
    }
  }

}