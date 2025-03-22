import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EventBus } from '../bootstrap/eventbus';
import * as monaco from 'monaco-editor';
import { CodeExecutionService } from '../../../services/game/code-execution.service';

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent implements OnInit {
  private service = inject(CodeExecutionService)

  protected isActive: boolean = false;
  protected editor!: monaco.editor.IStandaloneCodeEditor;
  @ViewChild('editorElement', { static: true }) editorElementRef!: ElementRef;
  protected editorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
    {
      theme: 'vs-dark',
      language: 'java',
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      lineNumbersMinChars: 2,
    };

  // TODO: Find a better way to pass in context data
  ngOnInit(): void {
    EventBus
      .on('editor-scene-active', (isActive: boolean) => {
        this.isActive = isActive;
      })
      .on('editor-execute-code', (stage: number) => {
        console.log(stage)
        this.executeCode(stage)
      });
  }

  protected onEditorInit(editor: any) {
    this.editor = editor;
  }

  private executeCode(stage: number) {
    console.log(this.editor.getValue())
    this.service.sendCodeToServer(this.editor.getValue(), stage)
  }
}
