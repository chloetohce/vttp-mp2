import { SCENES } from "../../../constants/scenes.const";

export class Lesson extends Phaser.Scene {
    constructor() {
        super(SCENES.LESSON)
    }

    create() {
        this.scene.start(SCENES.EDITOR)
    }

}