import { createReducer } from "@ngrx/store"
import { getPlayerData } from "./player.action"

export interface PlayerState {
    loading: boolean,
    username: string,
    stage: number
}

export const PLAYER_INIT: PlayerState = {
    loading: false,
    username: '',
    stage: 0,
}

export const playerReducer = createReducer(
    PLAYER_INIT,
    on()
)