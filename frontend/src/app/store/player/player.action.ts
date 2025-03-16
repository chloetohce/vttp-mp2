import { createAction, props } from "@ngrx/store";
import { PlayerState } from "./player.store";
import { PlayerData } from "../../model/player-data.model";

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