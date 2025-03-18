import { Action } from "@ngrx/store";
import { GameAction } from "../model/dialogue.model";

export const ACTIONS: Record<string, GameAction> = {
    "TEST": {
        type: "[Player] Get Player Data",
        action: (payload?: any) => ({
            type: '[Player] Get Player Data',
            item: payload
        })
    }
}