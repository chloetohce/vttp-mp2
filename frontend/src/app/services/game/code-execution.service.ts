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
  private loading = new BehaviorSubject<boolean>(false)

  stdOut$: Observable<string> = this.codeStdOut.asObservable()
  loading$ = this.loading.asObservable();

  constructor() { }

  sendCodeToServer(code: string, stage: number) {
    this.loading.next(true)
    const payload: Code = {
      code: code,
      context: {stage: stage}
    }
    this.http.post<{message: string}>('/api/code/execute', payload)
      .subscribe({
        next: v => {
          this.loading.next(false)
          console.log(v)
          this.codeStdOut.next(v.message)
        },
        error: v => {
          this.loading.next(false)
          console.log(v)
          this.codeStdOut.next(v.error.message ?? "Something went wrong...")
        }
      })
  }

  ngOnDestroy(): void {
  }
}
