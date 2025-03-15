import { createAction, props } from "@ngrx/store";
import { PlayerState } from "./player.store";

export const getPlayerData = createAction(
    '[Player] Get Player Data',
    props<{player: PlayerState}>()
)