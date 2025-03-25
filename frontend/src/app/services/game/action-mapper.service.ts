import { inject, Injectable } from '@angular/core';
import { ActionCreator, Store } from '@ngrx/store';
import { ACTIONS } from '../../constants/actions.const'
import { GameAction } from '../../model/dialogue.model';
import { ConditionsHolder } from '../../constants/conditions.const';
import { Bot } from '../../model/player-data.model';

@Injectable({
  providedIn: 'root',
})
export class ActionMapperService {
  private store = inject(Store);
  private actionMap: Record<string, GameAction> = ACTIONS;
  private conditionMap: Record<string, (payload?: any) => boolean> = ConditionsHolder.CONDITIONS;

  constructor() {}
  
  dispatchActionString(key: string, payload?: any) {
    console.log(key)
    console.log(payload)
    const act = this.actionMap[key]
    
    if (!act) {
      console.warn(`Action ${key} not registered.`)
    }

    if (act.action) {
      if (key === 'GAIN_BOT') {
        // Special case for bot objects which have a "type" property
        const botPayload = {
          bot: {
            type: payload.type,
            calls: payload.calls,
            id: payload.id,
            code: payload.code,
            name: payload.name
          }
        };
        this.store.dispatch(act.action({ botPayload }));
      } else {
        // For other actions, pass the payload directly
        this.store.dispatch(act.action(payload));
      }
    }
  }

  evaluateCondition(key: string) {
    return this.conditionMap[key]
  }
}
