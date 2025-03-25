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

    private btnRunCode!: Phaser.GameObjects.Text;
    private btnBack!: Phaser.GameObjects.Text;


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
    }

    create() {
        
        EventBus.emit('editor-bot-active', true, this.bot.code);
        console.log(this.bot.code)
        // Display the bot's current details
        this.add
            .text(this.width *0.9, this.height * 0.1, 'EDIT BOT', {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#ffffff',
                align: 'center',
            })
            .setOrigin(0.5);

        // Bot name input
        this.btnRunCode = this.add.text(10, this.height * 0.8, 'Save Code', {
                backgroundColor: '#4a4a4a',
                padding: {x: 10, y: 5},
                color: '#ffffff'
            }).setInteractive({useHandCursor: true})
                .on('pointerup', () => {
                    this.saveBotChanges(this.bot)
                })

        
       
    }

    private saveBotChanges(updatedBot: Bot) {
        console.log('Saving bot changes:', updatedBot);
        EventBus.emit('editor-bot-update-code', this.bot.name)
        EventBus.emit('editor-bot-active', false)
        this.scene.sleep()
        this.scene.start(SCENES.BOTS); // Return to the Bots scene
    }
}