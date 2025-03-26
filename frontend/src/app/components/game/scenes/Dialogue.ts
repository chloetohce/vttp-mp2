import { GameObjects } from "phaser";
import { Subscription } from "rxjs";
import { DialogueManager } from "../../../services/game/dialogue.manager";
import { DialogueNode } from "../../../model/dialogue.model";
import { SCENES } from "../../../constants/scenes.const";
import { ActionMapperService } from "../../../services/game/action-mapper.service";
import { EventBus } from "../bootstrap/eventbus";

export class Dialogue extends Phaser.Scene {
    // constants
    width!: number
    height!: number
    dataKey!: string
    chatX!: number
    chatY!: number
    chatWidth!:number
    choicesY!: number
    variables!: Record<string, string>
    speaker!: string;

    // tools
    private dialogueManager!: DialogueManager;

    // game-related objects
    private container!: GameObjects.Container;
    private dialogueContainer!: GameObjects.Container;
    private choicesContainer!: GameObjects.Container;
    private portrait!: GameObjects.Sprite;
    private currDialogue!: GameObjects.Text | undefined;
    private choicesList: GameObjects.Text[] = [];

    private currentNodeSub!: Subscription;

    constructor() {
        super(SCENES.DIALOGUE);
    }

    init(data: any) {
        this.width = this.game.renderer.width;
        this.height = this.game.renderer.height;
        this.chatX = this.width * 0.7
        this.chatY = 0
        this.choicesY = this.height * 0.8
        this.chatWidth = this.width - this.chatX

        this.dataKey = data.key;
        this.speaker = data.speaker
    }

    preload() {
        this.load.setPath('/phaser')
        this.load.json(`dialogue-${this.dataKey}`, `dialogues/${this.dataKey}.json`)
        // this.load.image('chara', `npc/${this.speaker}.png`)
        this.load.spritesheet(`chara-${this.speaker}`, `npc/${this.speaker}.png`,
            {frameWidth: 48, frameHeight: 48}
        )
    }
    
    create() {
        console.log(`LAUNCHING DIALOGUE WITH ${this.speaker}: ${this.dataKey}.json`)
        // Init dialogue manager
        this.dialogueManager = new DialogueManager(
            this.cache.json.get(`dialogue-${this.dataKey}`) as Record<string, DialogueNode>,
            this.registry.get('actionMapper') as ActionMapperService
        )
        
        // Creating and placing objects
        this.container = this.add.container(this.chatX, this.chatY)
        
        const background = new GameObjects.Rectangle(
            this,
            0, 
            0, 
            this.width * 0.4, 
            this.height,
            0x000000,
            0.2
        )
        .setDepth(0)
        .setOrigin(0,0)
        background.setInteractive()
        this.container.add(background)
        
        this.dialogueContainer = this.add.container(0, 0)
        this.container.add(this.dialogueContainer)

        this.choicesContainer = this.add.container(this.chatX, this.choicesY)
        
        // TODO: Modify scaling and positioning based on game sprites
        this.portrait = this.add.sprite(
            50, this.height - this.choicesY,
            `chara-${this.speaker}`
        )
        .setScale(7)
        .setOrigin(0.5, 1)

        if (this.speaker == 'note') {
            this.portrait.setScale(3)
        }

        this.choicesContainer.add(this.portrait)
        this.anims.create({
            key: `idle-${this.speaker}`,
            frames: this.anims.generateFrameNames(`chara-${this.speaker}`, {
                start: 0,
                end: 3
            }),
            frameRate: 2,
            repeat: -1
        })
        this.portrait.play(`idle-${this.speaker}`)
        
        // Preparing dialogue
        this.currentNodeSub = this.dialogueManager.currentNode$.subscribe(n => {
            this.displayCurrentNode(n);
        })
        this.startDialogue()

        // Interaction
        background.on('pointerdown', () => {

            // No effect if there are choices available
            if (this.dialogueManager.isChoicesAvailable()) 
                return;
            
            this.advanceDialogue();

        })
    }

    override update(time: number, delta: number): void {
        EventBus.on('dialogue-end-close', () => {
            this.currDialogue = undefined
        })
    }

    private startDialogue() {
        this.dialogueManager.start();
    }

    private advanceDialogue(choiceIndex?: string) {
        this.choicesList.forEach(c => this.choicesContainer.remove(c, true))
        this.dialogueManager.next(choiceIndex);
    }

    private displayCurrentNode(node: DialogueNode | null) {
        if (!node) {
            return;
        }
        
        this.displayDialogueText(node, 10, 5);
        this.displayChoices()
    }

    private displayDialogueText(node: DialogueNode, x: number, y: number, isPlayer?: boolean) {
        let yOffset;
        if (this.currDialogue)
            yOffset = this.currDialogue.getBottomLeft().y;
        else
            yOffset = 0

        this.currDialogue = this.add.text(
            x, y + yOffset,
            this.replacePlaceholders(node.text, this.variables),
            {
                fontFamily: 'vcr',
                fontSize: '16px',
                color: '#ffffff',
                padding: {x: 5, y: 5},
                resolution: 0,
                align: isPlayer ? 'right' : 'left',
                wordWrap: {width: this.chatWidth - 20, useAdvancedWrap: false},
            }
        )
            .setAlpha(0.8)
            .setOrigin(isPlayer ? 1 : 0, 0)
        
        this.dialogueContainer.add(this.currDialogue)
    }

    private displayChoices() {
        const choices = this.dialogueManager.getCurrentChoices()
        let yOffset = 10;
        
        choices.forEach((choice, i) => {
            const choiceText = this.add.text(
              50,
              yOffset,
              choice.text,
              {
                fontFamily: 'vcr',
                fontSize: '16px',
                color: '#ffffff',
                padding: { x: 5, y: 5 },
                resolution: 3,
                wordWrap: {
                  width: this.chatWidth - 20,
                  useAdvancedWrap: true,
                },
                backgroundColor: '#232121',
              }
            );

            // Interaction
            choiceText.setInteractive({useHandCursor: true})
                .on('pointerup', () => {
                    const playerResponse: DialogueNode = {
                        text: choice.text,
                        next: choice.next
                    }
                    this.displayDialogueText(playerResponse, this.chatWidth, 5, true)
                    this.advanceDialogue(choice.text)
                })
                .on('pointerover', () => {
                    choiceText.setBackgroundColor('#44444444')
                })
                .on('pointerout', () => {
                    choiceText.setBackgroundColor('#232121')
                })
            
            this.choicesContainer.add(choiceText)
            this.choicesList.push(choiceText)

            yOffset += choiceText.height + 10;
        })

    }

    private replacePlaceholders(text: string, variables: Record<string, string>): string {
        return text.replace(/\${(.*?)}/g, (_, key) => variables[key] || '');
    }

    shutdown() {
        if (this.currentNodeSub) {
            this.currentNodeSub.unsubscribe();
        }
    }

}