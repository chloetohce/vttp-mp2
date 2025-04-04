import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.store';
import { firstValueFrom, take, takeLast, tap } from 'rxjs';
import { PlayerState, selectPlayerState, selectStage } from '../../store/player/player.store';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private store: Store<AppState> = inject(Store)
  private http = inject(HttpClient)

  constructor() { }

  startNextDay(username: string) {
    let state!: PlayerState;
    this.store.select(selectPlayerState)
      .pipe( 
        tap(v => console.log(v))
      )
      .subscribe(v => state = v)
    return this.http.post<{name: string, output: number}[]>(
      `/api/player/next/${username}`, state
    )
  } 

  reset(username: string) {
    this.http.delete('/api/player/reset', {
      params: new HttpParams().append('username', username)
    })
      .subscribe({
        next: () => console.log("delete ok"),
        error: (err) => console.log(err.error)
      })
  }
}
