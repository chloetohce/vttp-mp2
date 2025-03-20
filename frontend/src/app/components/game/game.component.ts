import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EventBus } from './bootstrap/eventbus';
import { Store } from '@ngrx/store';
import { AUTO, Game } from 'phaser';
import { Boot } from './scenes/Boot';
import { Tutorial } from './scenes/Tutorial';
import { Dialogue } from './scenes/Dialogue';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { ActionMapperService } from '../../services/game/action-mapper.service';
import { Menu } from './scenes/Menu';
import { Lesson } from './scenes/Lesson';
import { Editor } from './scenes/Editor';
import { EditorComponent } from './editor/editor.component';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit, OnDestroy {
  private store: Store = inject(Store);
  private actionMapper = inject(ActionMapperService)

  @ViewChild(EditorComponent) editorComponent!: EditorComponent

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
    scene: [Boot, Tutorial, Dialogue, Menu, Lesson, Editor],
    plugins: {
      scene: [
        {
          key: 'rexUI',
          plugin: UIPlugin,
          mapping: 'rexUI'
        }
      ]
    }
  };

  ngOnInit(): void {
    this.game = new Game(this.config);

    this.game.registry.set('store', this.store);
    this.game.registry.set('actionMapper', this.actionMapper)

    EventBus.on('current-scene-ready', (scene: Phaser.Scene) => {
      this.scene = scene;

      if (this.sceneCallback) {
        this.sceneCallback(scene);
      }
    });

    window.addEventListener('resize', () => {
      this.game.scale.displaySize.setAspectRatio(window.innerWidth / window.innerHeight)
      this.game.scale.refresh()
    })

  }

  ngOnDestroy(): void {
    if (this.game) {
      this.game.destroy(true);
    }
  }
}
