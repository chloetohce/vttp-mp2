import { RouteConfigLoadEnd } from "@angular/router";
import { AUTO, Game } from "phaser";

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    dom: {
        createContainer: true
    }
}

const StartGame = () => {
    return new Game(config);
}

export default StartGame;