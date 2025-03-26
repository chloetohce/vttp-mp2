import { Store } from "@ngrx/store";
import { SCENES } from "../../../constants/scenes.const";
import { Bot } from "../../../model/player-data.model";
import { CodeExecutionService } from "../../../services/game/code-execution.service";
import { AppState } from "../../../store/app.store";
import { EventBus } from "../bootstrap/eventbus";
import { updateBotCode } from "../../../store/player/player.action";

export class EditBot extends Phaser.Scene {
    private width!: number;
    private height!: number;
    private bot!: Bot; 
    private codeService!: CodeExecutionService
    private store!: Store<AppState>

    private btnRunText!: Phaser.GameObjects.Text;
  private btnRun!: Phaser.GameObjects.Image;
  private btnBackIcon!: Phaser.GameObjects.Image;
  private btnBack!: Phaser.GameObjects.Image;


    constructor() {
        super(SCENES.EDITBOT);
    }

    init(data: { bot: Bot }) {
        this.width = this.game.renderer.width;
        this.height = this.game.renderer.height;
        this.bot = data.bot; // Get the bot data passed from the Bots scene
        this.codeService = this.game.registry.get('codeService')

    }

    preload() {
        // Load any assets needed for the edit scene
        // this.load.image('btn-save', '/phaser/bots/save.png');
        // this.load.image('btn-back', '/phaser/bots/back.png');
        this.load.image('btn-red', '/phaser/misc/red-btn.png')
    this.load.image('btn-sq', '/phaser/misc/btn-square.png')
    this.load.image('btn-back', '/phaser/icons/back.png')
    }

    create() {
        EventBus.emit('editor-bot-active', true, this.bot.code);
        this.scene.launch(SCENES.DIALOGUE, {key: this.bot.type, speaker: 'note'})
        
        // Display the bot's current details

        this.btnRun = this.add.image(55 + this.width * 0.3, this.height * 0.79, 'btn-red')
      .setOrigin(0)
      .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
          this.saveBotChanges(this.bot)
          this.scene.stop(SCENES.DIALOGUE)
        })
        .on('pointerover', () => {
          this.btnRun.setTint(0xaaaaaa)
        })
        .on('pointerout', () => {
          this.btnRun.clearTint()
        })
    this.btnRunText = this.add.text(this.btnRun.getCenter().x, 
        this.btnRun.getCenter().y + 1, 'Save')
        .setOrigin(0.5)

    this.btnBack = this.add.image(55, this.height * 0.79, 'btn-sq')
        .setOrigin(0)
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
          this.scene.start(SCENES.BOTS)
          this.scene.stop(SCENES.DIALOGUE)
          EventBus.emit('editor-scene-active', false)
          EventBus.emit('dialogue-end-close')
        })
        .on('pointerover', () => {
          this.btnBack.setTint(0xaaaaaa)
          this.btnBackIcon.setTint(0xaaaaaa)
        })
        .on('pointerout', () => {
          this.btnBack.clearTint()
          this.btnBackIcon.clearTint()
        })
        this.btnBackIcon = this.add.image(this.btnBack.getCenter().x, this.btnBack.getCenter().y, 'btn-back')
    
       
    }

    private saveBotChanges(updatedBot: Bot) {
        EventBus.emit('editor-bot-update-code', this.bot.name)
        EventBus.emit('editor-bot-active', false)
        EventBus.emit('dialogue-end-close')
        this.scene.sleep()
        this.scene.start(SCENES.BOTS); // Return to the Bots scene
    }
}