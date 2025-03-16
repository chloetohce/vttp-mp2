import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PlayerData } from '../model/player-data.model';
import { Observable } from 'rxjs';

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
}
