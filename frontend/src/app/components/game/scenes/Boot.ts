import { Store } from '@ngrx/store';
import { selectHp, selectLoading, selectStage } from '../../../store/player/player.store';
import { filter, firstValueFrom, map, take, tap } from 'rxjs';
import { AppState } from '../../../store/app.store';
import { SCENES } from '../../../constants/scenes.const';
import { getPlayerData } from '../../../store/player/player.action';
import { GameObjects, Time } from 'phaser';

export class Boot extends Phaser.Scene {
  private store!: Store<AppState>;

  private stage!: number;
  private username!: string;
  private width!: number;
  private height!: number;
  private isLoading!: boolean;

  private loadingText!: Phaser.GameObjects.Text;
  private updateTimer!: Time.TimerEvent;

  constructor() {
    super({
      key: SCENES.BOOT,
    });
  }

  init() {
    this.store = this.registry.get('store');
    this.username = this.game.registry.get('username');
    this.stage = this.game.registry.get('stage');
    this.width = this.game.renderer.width;
    this.height = this.game.renderer.height;
  }

  preload() {
    // this.load.plugin('rexanchorplugin',
    //     'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexanchorplugin.min.js',
    //     true);
    this.store.dispatch(getPlayerData({username: this.username}))
  }

  async create() {
    // Create loading text
    this.loadingText = this.add
      .text(this.width / 2 - 50, this.height / 2, 'Loading', {
        font: '24px',
        color: '#ffffff',
      })
      .setOrigin(0);

    this.loadingText.setVisible(false);

    this.updateTimer = this.time.addEvent({
      delay: 500,
      callback: this.updateLoadingText,
      callbackScope: this,
      loop: true,
    });

    this.showLoading()

    this.isLoading = await firstValueFrom(
      this.store.select(selectLoading).pipe(
        filter((loading) => !loading),
        take(1)
      )
    );

    // Check for HP
    const hp = await firstValueFrom(
      this.store.select(selectHp).pipe(
        take(1)
      )
    )

    if (hp < 1) {
      this.scene.start(SCENES.GAMEOVER)
    }

    this.stage = await firstValueFrom(
      this.store.select(selectStage).pipe(
        filter((stage) => stage !== undefined),
        take(1)
      )
    );

    this.hideLoading()

    

    // Start the appropriate scene based on the stage
    if (this.stage === 0) {
      this.scene.start(SCENES.TUTORIAL);
    } else {
      this.scene.start(SCENES.MENU);
    }
  }

  private showLoading() {
    this.isLoading = true;
    this.loadingText.setVisible(true);
  }

  updateLoadingText() {
    const dots = this.loadingText.text.replace('Loading', '').length;
    let add = '';
    if (dots < 3) {
      add += '.'.repeat(dots + 1);
    }
    this.loadingText.setText(`Loading${add}`);
  }

  private hideLoading() {
    this.isLoading = false;
    this.loadingText.setVisible(false);
    this.updateTimer.remove();
  }
}
