import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectStage } from '../store/player/player.store';
import { firstValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private store = inject(Store)

  constructor() { }

  async getStage() {
    return await firstValueFrom(this.store.select(selectStage)
      .pipe(take(1)))
  }
}
