import { createReducer, createSelector, on } from "@ngrx/store"
import { getPlayerData, getPlayerDataFailure, setPlayerData } from "./player.action"

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
    on(setPlayerData, (state, {data}) => ({
        ...state,
        ...data,
        loading: false
    })),
    on(getPlayerData, (state, {username}) => ({
        ...state,
        loading: true,
        username
    })),
    on(getPlayerDataFailure, (state) => ({
        ...state,
        loading: false
    }))
)

// Selectors
export const selectPlayerState = (state: {player: PlayerState}) => state.player

export const selectUsername = createSelector(
    selectPlayerState,
    (state: PlayerState) => state.username
)

export const selectStage = createSelector(
    selectPlayerState,
    (state: PlayerState) => state.stage
)
export const selectLoading = createSelector(
    selectPlayerState,
    (state: PlayerState) => state.loading
)