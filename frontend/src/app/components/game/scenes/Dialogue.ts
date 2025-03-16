import { inject } from "@angular/core";
import { GameObjects } from "phaser";
import { debounce, Observable, of, Subscription } from "rxjs";
import { DialogueManager } from "../../../services/game/dialogue.manager";
import { DialogueChoice, DialogueNode } from "../../../model/dialogue.model";

export class Dialogue extends Phaser.Scene {
    // constants
    width!: number
    height!: number
    dataKey!: string
    demoStr: string = "this is a demo"

    // tools
    private dialogueManager!: DialogueManager;

    // game-related objects
    private container!: GameObjects.Container;
    private choicesContainer!: GameObjects.Container;
    private portrait!: GameObjects.Sprite;
    private currDialogue!: GameObjects.Text;

    private currentNodeSub!: Subscription;

    constructor() {
        super("dialogue");
    }

    init(key: string) {
        this.width = this.game.renderer.width;
        this.height = this.game.renderer.height;

        this.dataKey = key;
    }

    preload() {
        this.load.setPath('assets/phaser')
        this.load.image('placeholder-chara', 'placeholder-chara.png')
        this.load.json(`dialogue-${this.dataKey}`, `dialogues/${this.dataKey}.json`)
    }
    
    create() {
        // Init dialogue manager
        this.dialogueManager = new DialogueManager(this.cache.json.get(`dialogue-${this.dataKey}`) as Record<string, DialogueNode>)
        
        // Creating and placing objects
        this.container = this.add.container(this.width * 0.6, 0)
        
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
        
        this.choicesContainer = this.add.container(this.width * 0.6, this.height * 0.7)
        
        // TODO: Modify scaling and positioning based on game sprites
        this.portrait = this.add.sprite(
            0, 0,
            'placeholder-chara'
        )
        .setScale(0.15)
        .setOrigin(0.1, 0)
        this.choicesContainer.add(this.portrait)
        
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

    private startDialogue() {
        this.dialogueManager.start();
    }

    private advanceDialogue(choiceIndex?: number) {
        this.dialogueManager.next(choiceIndex);
    }

    private displayCurrentNode(node: DialogueNode | null) {
        if (!node) {
            return;
        }
        
        this.displayDialogueText(node, 10, 10);
        this.displayChoices(node.choices ?? [])
    }

    private displayDialogueText(node: DialogueNode, x: number, y: number) {
        let yOffset;
        if (this.currDialogue)
            yOffset = this.currDialogue.getBottomLeft().y;
        else
            yOffset = 0

        this.currDialogue = this.add.text(
            x, y + yOffset,
            this.replacePlaceholders(node.text, {demoString: 'this is a demo'}),
            {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#ffffff',
                padding: {x: 5, y: 5},
                resolution: 3,
                wordWrap: {width: this.width * 0.4 - 20, useAdvancedWrap: false},
                backgroundColor: '#232121',
            }
        )
            .setAlpha(0.8)

        this.container.add(this.currDialogue)
    }

    private displayChoices(choices: DialogueChoice[]) {
        let yOffset = 10;
        
        choices.forEach((choice, i) => {
            const choiceText = this.add.text(
              this.portrait.getTopRight().x + 20,
              yOffset,
              choice.text,
              {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#ffffff',
                padding: { x: 5, y: 5 },
                resolution: 3,
                wordWrap: {
                  width: this.width * 0.4 - 20,
                  useAdvancedWrap: true,
                },
                backgroundColor: '#232121',
              }
            );

            // Interaction
            choiceText.setInteractive({useHandCursor: true})
                .on('pointerup', () => {
                    this.advanceDialogue(i)
                })
                .on('pointerover', () => {
                    choiceText.setBackgroundColor('#44444444')
                })
                .on('pointerout', () => {
                    choiceText.setBackgroundColor('#232121')
                })
            
            this.choicesContainer.add(choiceText)
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