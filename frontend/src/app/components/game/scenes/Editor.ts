import { firstValueFrom, of } from "rxjs";
import { SCENES } from "../../../constants/scenes.const";
import { CodeExecutionService } from "../../../services/game/code-execution.service";
import { EventBus } from "../bootstrap/eventbus";

export class Editor extends Phaser.Scene {
  // Constants
  private width!: number;
  private height!: number;
  private stage!: number;

  // Helpers and services
  private codeService!: CodeExecutionService

  // Scene Objects
  private btnRunText!: Phaser.GameObjects.Text;
  private btnRun!: Phaser.GameObjects.Image;
  private btnBackIcon!: Phaser.GameObjects.Image;
  private btnBack!: Phaser.GameObjects.Image;
  private stdOutContainer!: Phaser.GameObjects.Container;
  private stdOutText!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENES.EDITOR);
  }

  init(data: any) {
    this.width = this.game.renderer.width;
    this.height = this.game.renderer.height;
    this.stage = data.stage;
    this.codeService = this.game.registry.get('codeService')
  }

  preload() {
    this.load.image('btn-red', '/phaser/misc/red-btn.png')
    this.load.image('btn-sq', '/phaser/misc/btn-square.png')
    this.load.image('btn-back', '/phaser/icons/back.png')
  }

  create() {
    EventBus.emit('editor-scene-active', true);
    this.btnRun = this.add.image(55 + this.width * 0.3, this.height * 0.79, 'btn-red')
      .setOrigin(0)
      .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
          EventBus.emit('editor-execute-code', this.stage);
        })
        .on('pointerover', () => {
          this.btnRun.setTint(0xaaaaaa)
        })
        .on('pointerout', () => {
          this.btnRun.clearTint()
        })
    this.btnRunText = this.add.text(this.btnRun.getCenter().x, this.btnRun.getCenter().y + 1, 'Run')
        .setOrigin(0.5)

    this.btnBack = this.add.image(55, this.height * 0.79, 'btn-sq')
        .setOrigin(0)
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
          this.scene.start(SCENES.LESSON)
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
        
    this.stdOutContainer = this.add.container(55, this.btnRun.getBottomCenter().y + 5);

    this.stdOutText = this.add.text(2, 2, "", {
      fontSize: '12px',
      wordWrap: {width: this.width * 0.7 - 55}
    })
    this.stdOutContainer.add(this.stdOutText)

    this.scene.launch(SCENES.DIALOGUE, {key: this.stage, speaker: 'kade'})
  }

  override async update() {
    if ((await firstValueFrom(this.codeService.loading$)) == true ) {
      this.btnRunText.setText("...")
    } else {
      this.btnRunText.setText("Run")
    }
    this.stdOutText.setText(await firstValueFrom(this.codeService.stdOut$))
  }
}