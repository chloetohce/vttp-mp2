import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/authentication/auth.service';
import StartGame from './bootstrap/main';
import { EventBus } from './bootstrap/eventbus';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit, OnDestroy{
  scene!: Phaser.Scene;
  game!: Phaser.Game;
  sceneCallback!: (scene: Phaser.Scene) => void

  ngOnInit(): void {
    this.game = StartGame();

    EventBus.on('current-scene-ready', (scene: Phaser.Scene) => {
      this.scene = scene;

      if (this.sceneCallback) {
        this.sceneCallback(scene)
      }
    })
  }

  ngOnDestroy(): void {
    if (this.game) {
      this.game.destroy(true);
    }
  }
}
