import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PlayerData } from '../model/player-data.model';
import { map, Observable } from 'rxjs';
import { selectUsername } from '../store/authentication/auth.store';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private http = inject(HttpClient);
  private store = inject(Store)

  constructor() { }

  getPlayerData(username: string): Observable<PlayerData> {
    return this.http.get<PlayerData>('/api/player/data', {
      params: new HttpParams().append("username", username)
    })
  }

  updatePlayerData(data: PlayerData) {
    let username!: string;
    this.store.select(selectUsername)
      .subscribe(v => username = v)
      .unsubscribe()
    return this.http.put('/api/player/update', data, 
      {
        params: new HttpParams().append('username', username)
      }
    )
  }

  getStage(username: string) {
    return this.http.get<number>('/api/player/stage', 
      {
        params: new HttpParams().append('username', username)
      }
    )
  }
}
