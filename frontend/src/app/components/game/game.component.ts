import { AfterViewInit, Component, inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { EventBus } from './bootstrap/eventbus';
import { select, Store } from '@ngrx/store';
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
import { CodeExecutionService } from '../../services/game/code-execution.service';
import { getPlayerData } from '../../store/player/player.action';
import { selectUsername } from '../../store/authentication/auth.store';
import { BehaviorSubject, firstValueFrom, Subject, take } from 'rxjs';
import { AppState } from '../../store/app.store';
import { selectStage } from '../../store/player/player.store';
import { PlayerService } from '../../services/player.service';
import { GameStateService } from '../../services/game/game-state.service';
import { Bots } from './scenes/Bots';
import { EditBot } from './scenes/EditBot';
import { EndDay } from './scenes/EndDay';
import { GameOver } from './scenes/GameOver';
import { Map } from './scenes/Map';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit, OnDestroy, AfterViewInit {
  private store: Store<AppState> = inject(Store);
  private actionMapper = inject(ActionMapperService)
  private codeService = inject(CodeExecutionService)
  private gameService = inject(GameStateService)

  @ViewChild(EditorComponent) editorComponent!: EditorComponent


  scene!: Phaser.Scene;
  game!: Phaser.Game;
  sceneCallback!: (scene: Phaser.Scene) => void;

  isEditorActive: boolean = false;
  botCode: string = ''

  private config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    parent: '.game-container',
    backgroundColor: '#18181B',
    scale: {
      mode: Phaser.Scale.ENVELOP,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    pixelArt: true,
    scene: [Boot, Tutorial, Dialogue, Menu, Lesson, Editor, EditBot, EndDay, GameOver,Map, Bots],
  };

  async ngOnInit() {
    const username: string = await firstValueFrom(this.store.select(selectUsername)
    .pipe(take(1)))
    
    this.game = new Game(this.config)
    
    this.game.registry.set('store', this.store);
    this.game.registry.set('actionMapper', this.actionMapper)
    this.game.registry.set('codeService', this.codeService)
    this.game.registry.set('svc', this.gameService)
    this.game.registry.set('username', username)
    
    
    

    window.addEventListener('resize', () => {
      this.game.scale.displaySize.setAspectRatio(window.innerWidth / window.innerHeight)
      this.game.scale.refresh()
    })

  }

  ngAfterViewInit(): void {
    EventBus.on('current-scene-ready', (scene: Phaser.Scene) => {
      this.scene = scene;

      if (this.sceneCallback) {
        this.sceneCallback(scene);
      }
    })
    .on('editor-scene-active', (isActive: boolean) => {
      this.isEditorActive = isActive;
      this.botCode = ''
    })
    .on('editor-bot-active', (isActive: boolean, code: string) => {
      this.isEditorActive = isActive;
      this.botCode = code ? code : '';
    })
  }

  ngOnDestroy(): void {
    if (this.game) {
      this.game.destroy(true);
    }
  }
}
