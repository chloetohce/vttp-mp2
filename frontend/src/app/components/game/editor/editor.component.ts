import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EventBus } from '../bootstrap/eventbus';
import * as monaco from 'monaco-editor';
import { CodeExecutionService } from '../../../services/game/code-execution.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.store';
import { updateBotCode } from '../../../store/player/player.action';

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent implements OnInit {
  private service = inject(CodeExecutionService)
  private store: Store<AppState> = inject(Store)

  protected isActive: boolean = false;
  editor!: monaco.editor.IStandaloneCodeEditor;
  @ViewChild('editorElement', { static: true }) editorElementRef!: ElementRef;

  @Input() code!: String;


  protected editorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
    {
      theme: 'vs-dark',
      language: 'java',
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      lineNumbersMinChars: 2,
    };

    constructor() {
      EventBus
      .on('editor-scene-active', (isActive: boolean) => {
        this.isActive = isActive;
      })
      .on('editor-execute-code', (stage: number) => {
        this.executeCode(stage)
      })
      .on('editor-bot-active', (isActive: boolean) => {
        this.isActive = isActive;
      })
      .on('editor-bot-update-code', (name: string) =>{
        console.log(`Updating bot ${name}`)
        this.store.dispatch(updateBotCode({name: name, code: this.editor.getValue()}))
      })
      
    }

  // TODO: Find a better way to pass in context data
  ngOnInit(): void {
  }

  protected onEditorInit(editor: any) {
    this.editor = editor;
    
  }

  private executeCode(stage: number) {
    this.service.sendCodeToServer(this.editor.getValue(), stage)
  }
}
