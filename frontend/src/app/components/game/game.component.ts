import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EventBus } from './bootstrap/eventbus';
import { Store } from '@ngrx/store';
import { AUTO, Game } from 'phaser';
import { Boot } from './scenes/Boot';
import { Tutorial } from './scenes/Tutorial';
import { Dialogue } from './scenes/Dialogue';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit, OnDestroy {
  private store: Store = inject(Store);

  scene!: Phaser.Scene;
  game!: Phaser.Game;
  sceneCallback!: (scene: Phaser.Scene) => void;

  private config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#18181B',
    scale: {
      mode: Phaser.Scale.ENVELOP,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    pixelArt: true,
    scene: [Boot, Tutorial, Dialogue],
  };

  ngOnInit(): void {
    this.game = new Game(this.config);

    this.game.registry.set('store', this.store);

    EventBus.on('current-scene-ready', (scene: Phaser.Scene) => {
      this.scene = scene;

      if (this.sceneCallback) {
        this.sceneCallback(scene);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.game) {
      this.game.destroy(true);
    }
  }
}
