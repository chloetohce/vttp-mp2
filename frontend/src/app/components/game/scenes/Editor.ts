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
  private btnRunCode!: Phaser.GameObjects.Text;
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

  create() {
    const title = this.add
      .text(400, 50, 'Code Editor', {
        fontSize: '32px',
        color: '#ffffff',
      })
      .setOrigin(0.5, 0);

    this.btnRunCode = this.add.text(10, this.height * 0.8, 'Run Code', {
        backgroundColor: '#4a4a4a',
        padding: {x: 10, y: 5},
        color: '#ffffff'
    }).setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            EventBus.emit('editor-execute-code', this.stage);
        })

    EventBus.emit('editor-scene-active', true);

    this.stdOutContainer = this.add.container(0, this.btnRunCode.getBottomCenter().y + 5);

    this.stdOutText = this.add.text(2, 2, "")
    this.stdOutContainer.add(this.stdOutText)

    // this.scene.launch(SCENES.DIALOGUE, {key: this.stage})
  }

  override async update() {
    if ((await firstValueFrom(this.codeService.loading$)) == true ) {
      this.btnRunCode.setText("...")
    } else {
      this.btnRunCode.setText("Run Code")
    }
    this.stdOutText.setText(await firstValueFrom(this.codeService.stdOut$))
  }
}