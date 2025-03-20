import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EventBus } from '../bootstrap/eventbus';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent implements OnInit {
  protected isActive!: boolean;
  protected editor!: monaco.editor.IStandaloneCodeEditor;

  protected editorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
    {
      theme: 'vs-dark',
      language: 'java',
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      lineNumbersMinChars: 2,
    };

  ngOnInit(): void {
    EventBus
      .on('editor-scene-active', (isActive: boolean) => {
        this.isActive = isActive;
        if (!isActive) {
        } else {
        }
      }).on('editor-execute-code', () => {
        this.executeCode()
      });
  }

  protected onEditorInit(editor: any) {
    this.editor = editor;
  }

  private executeCode() {
    console.log(this.editor.getValue())
  }
}
