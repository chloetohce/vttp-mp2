import { createAction, props } from "@ngrx/store";
import { PlayerState } from "./player.store";
import { Bot, PlayerData } from "../../model/player-data.model";

export const getPlayerData = createAction(
    '[Player] Get Player Data',
    props<{username: string}>()
)

export const getPlayerDataFailure = createAction(
    '[Player] Get Player Data Failure',
    props<{error: any}>()
);

export const setPlayerData = createAction(
    '[Player] Set Player Data',
    props<{data: PlayerData}>()
)

export const endDay = createAction(
    '[Game] End Game Day'
)

export const endDaySuccess = createAction(
    '[Game] End Game Day Success'
)

export const increaseStage = createAction(
    '[Game] Increase stage',
    props<{currStage: number}>()
)

export const getInjector = createAction(
    '[Game] Gain injector'
)

export const gainBot = createAction(
    '[Game] Gain Basic Bot'
)

export const updateBotCode = createAction(
    '[Game] Update Bot Code',
    props<{name: string, code:string}>()
)

export const restart = createAction(
    '[Game] Restart',
    props<{username: string}>()
)