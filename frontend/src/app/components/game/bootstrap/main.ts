import { RouteConfigLoadEnd } from "@angular/router";
import { AUTO, Game } from "phaser";
import { Boot } from "../scenes/Boot";
import { Tutorial } from "../scenes/Tutorial";
import { Dialogue } from "../scenes/Dialogue";

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#18181B',
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    pixelArt: true,
    scene: [
        Boot, 
        Tutorial,
        Dialogue
    ]
}

const StartGame = () => {
    return new Game(config);
}

export default StartGame;