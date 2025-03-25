import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.store';
import { firstValueFrom, take } from 'rxjs';
import { PlayerState, selectPlayerState, selectStage } from '../../store/player/player.store';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private store: Store<AppState> = inject(Store)
  private http = inject(HttpClient)

  constructor() { }

  startNextDay(username: string) {
    let state!: PlayerState;
    this.store.select(selectPlayerState).subscribe(v => state = v)
    return this.http.post<{name: string, output: number}[]>(
      `/api/player/next/${username}`, state
    )
  }
}
