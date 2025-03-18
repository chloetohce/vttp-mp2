import { inject, Injectable } from '@angular/core';
import { ActionCreator, Store } from '@ngrx/store';
import { ACTIONS } from '../../constants/actions.const'
import { GameAction } from '../../model/dialogue.model';
import { ConditionsHolder } from '../../constants/conditions.const';

@Injectable({
  providedIn: 'root',
})
export class ActionMapperService {
  private store = inject(Store);
  private actionMap: Record<string, GameAction> = ACTIONS;
  private conditionMap: Record<string, (payload?: any) => boolean> = ConditionsHolder.CONDITIONS;

  constructor() {}
  
  dispatchActionString(key: string) {
    console.log(key)
    const act = this.actionMap[key]
    
    if (!act) {
      console.warn(`Action ${key} not registered.`)
    }

    if (act.action) {
      this.store.dispatch(act.action(act.payload))
    }
  }

  evaluateCondition(key: string) {
    return this.conditionMap[key]
  }
}
