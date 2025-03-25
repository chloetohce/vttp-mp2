import { Action } from "@ngrx/store";
import { GameAction } from "../model/dialogue.model";
import { ITEMS } from "./items.const";

export const ACTIONS: Record<string, GameAction> = {
    "TEST": {
        type: "[Player] Get Player Data",
        action: (payload?: any) => ({
            type: '[Player] Get Player Data',
            item: payload
        })
    },
    "GAIN_INJECTOR": {
        type: '[Game] Gain injector',
        action: () => ({
            type: '[Game] Gain injector',
            item: ITEMS['INJECTOR']
        })
    },
    "GAIN_HP": {
        type: '[Game] Gain HP',
        action: (payload: any) => ({
            type: '[Game] Gain HP',
            item: payload
        })
    },
    "INCREASE_STAGE": {
        type: '[Game] Increase stage'
    },
    "GAIN_BOT": {
        type: '[Game] Gain Basic Bot',
        action: (payload: any) => ({
            type: '[Game] Gain Basic Bot',
            item: payload
        })
    }
}