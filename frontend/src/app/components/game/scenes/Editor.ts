import { SCENES } from "../../../constants/scenes.const";
import { EventBus } from "../bootstrap/eventbus";

export class Editor extends Phaser.Scene {
  private width!: number;
  private height!: number;

  // Scene Objects
  private btnRunCode!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENES.EDITOR);
  }

  init() {
    this.width = this.game.renderer.width;
    this.height = this.game.renderer.height;
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
            EventBus.emit('editor-execute-code');
        })

    EventBus.emit('editor-scene-active', true);
  }
}