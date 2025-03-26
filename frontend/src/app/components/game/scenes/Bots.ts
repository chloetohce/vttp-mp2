import { Store } from '@ngrx/store';
import { SCENES } from '../../../constants/scenes.const';
import { Bot, Item, PlayerData } from '../../../model/player-data.model';
import { AppState } from '../../../store/app.store';
import {
  BASIC_BOT,
  selectPlayerData,
} from '../../../store/player/player.store';
import { GameObjects } from 'phaser';

export class Bots extends Phaser.Scene {
  private width!: number;
  private height!: number;

  private playerData!: PlayerData;
  private store!: Store<AppState>;
  private bots!: Bot[];

  private btnBack!: GameObjects.Image;
  private btnBackIcon!: GameObjects.Image;

  constructor() {
    super(SCENES.BOTS);
  }

  init() {
    this.width = this.game.renderer.width;
    this.height = this.game.renderer.height;
    this.store = this.game.registry.get('store');
    this.store
      .select(selectPlayerData)
      .subscribe((v: PlayerData) => (this.playerData = v))
      .unsubscribe();
    this.bots = this.playerData.bots;
  }

  preload() {
    const distinctArr = [...new Set(this.bots.map((v) => v.type))];
    distinctArr.forEach((i) => {
      this.load.image(`bot-${i}`, `/phaser/bots/${i}.png`);
    });
    this.load.image('item-bg', '/phaser/bots/item-bg.png');
    this.load.image('btn-edit', '/phaser/bots/edit.png');
    this.load.image('btn-sq', '/phaser/misc/btn-square.png');
    this.load.image('btn-back', '/phaser/icons/back.png');
  }

  create() {
    this.add.rectangle(0, 0, this.width, this.height, 0x121212)
      .setOrigin(0)
    this.add
      .text(this.width / 2, this.height * 0.03, 'YOUR BOTS', {
        fontFamily: 'vcr',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    this.btnBack = this.add
      .image(this.width * 0.95, 64 * 0.5, 'btn-sq')
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => {
        this.scene.start(SCENES.MENU);
      })
      .on('pointerover', () => {
        this.btnBack.setTint(0xaaaaaa);
        this.btnBackIcon.setTint(0xaaaaaa);
      })
      .on('pointerout', () => {
        this.btnBack.clearTint();
        this.btnBackIcon.clearTint();
      });
    this.btnBackIcon = this.add.image(
      this.btnBack.getCenter().x,
      this.btnBack.getCenter().y,
      'btn-back'
    );

    this.createBotList();
  }

  private createBotList() {
    const startY = this.height * 0.1;
    const itemHeight = 128;

    // Create a container for each bot
    this.bots.forEach((bot, index) => {
      const y = startY + itemHeight * index;

      // Item background
      const itemBg = this.add
        .image(this.width / 2 + 20, y, 'item-bg')
        .setDisplaySize(this.width * 0.8, itemHeight)
        .setInteractive()
        .on('pointerover', () => {
          itemBg.setTint(0xdddddd);
        })
        .on('pointerout', () => {
          itemBg.clearTint();
        });

      // Bot sprite
      const botSprite = this.add
        .image(this.width * 0.175 + 20, y, `bot-${bot.type}`)
        .setDisplaySize(64, 64);

      // Bot name and details
      this.add
        .text(this.width * 0.25 + 20, y - 25, bot.name, {
          fontFamily: 'vcr',
          fontSize: '18px',
          color: '#020300',
          fontStyle: 'bold',
        })
        .setOrigin(0);

      this.add.text(this.width * 0.25 + 20, y, `Type: ${bot.type}`, {
        fontSize: '14px',
        color: '#21201C',
        fontStyle: 'bold italic',
      });

      // Edit button
      const editButton = this.add
        .image(this.width * 0.85, y - 15, 'btn-edit')
        .setDisplaySize(32, 32)
        .setScale(0.7)
        .setInteractive()
        .on('pointerover', () => {
          editButton.setTint(0xbbbbff);
        })
        .on('pointerout', () => {
          editButton.clearTint();
        })
        .on('pointerup', () => {
          this.editBot(bot);
        });
    });
  }

  editBot(bot: Bot) {
    this.scene.start(SCENES.EDITBOT, { bot: bot });
  }
}
