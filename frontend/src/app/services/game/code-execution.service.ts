import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { Code } from '../../model/code.model';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodeExecutionService implements OnDestroy {
  private http = inject(HttpClient)

  private codeStdOut = new BehaviorSubject<string>("")

  stdOut$: Observable<string> = this.codeStdOut.asObservable()

  constructor() { }

  sendCodeToServer(code: string, stage: number) {
    const payload: Code = {
      code: code,
      context: {stage: stage}
    }
    this.http.post<string>('/api/code/execute', payload)
      .subscribe(v => this.codeStdOut.next(v))
  }

  ngOnDestroy(): void {
  }
}
