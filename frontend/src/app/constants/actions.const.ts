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
    "CHANGE_HP": {
        type: '[Game] Change HP',
        action: (payload: any) => ({
            type: '[Game] Change HP',
            payload: payload
        })
    },
    "INCREASE_STAGE": {
        type: '[Game] Increase stage'
    },
    "GAIN_BOT": {
        type: '[Game] Gain Basic Bot',
        action: (payload: any) => ({
            type: '[Game] Gain Basic Bot',
            payload: payload
        })
    },
    "CHANGE_GOLD": {
        type: '[Game] Change Gold',
        action: (payload: any) => ({
            type: '[Game] Change Gold',
            payload: payload
        })
    },
    "CHANGE_ENERGY": {
        type: '[Game] Change Energy',
        action: (payload: any) =>({
            type: '[Game] Change Energy',
            payload: payload
        })
    }
}