import { createReducer, createSelector, on } from "@ngrx/store"
import { endDay, gainBot, getInjector, getPlayerData, getPlayerDataFailure, increaseStage, setPlayerData, updateBotCode } from "./player.action"
import { Bot, Item, PlayerData } from "../../model/player-data.model"
import { ITEMS } from "../../constants/items.const"
import { inject, INJECTOR } from "@angular/core"
import { PlayerService } from "../../services/player.service"


export interface PlayerState {
    loading: boolean,
    username: string,
    stage: number,
    day: number, 
    gold: number, 
    hp: number,
    energy: number,
    items: Item[],
    bots: Bot[]
}

export const PLAYER_INIT: PlayerState = {
    loading: false,
    username: '',
    stage: 0,
    day: 0,
    gold: 0,
    hp: 10,
    energy: 10,
    items: [],
    bots: [],
}

export const BASIC_BOT: Bot = {
    type: 'basic',
    calls: 2,
    id: 0,
    name: '',
    code: ''
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
    })),
    on(endDay, (state) => ({
        ...state,
        day: state.day + 1
    })),
    on(increaseStage, (state, {currStage}) => ({
        ...state,
        stage: (state.stage == currStage) ? state.stage + 1 : state.stage
    })),
    on(getInjector, (state) => ({
        ...state,
        items: [...state.items, ITEMS['INJECTOR']]
    })),
    on(gainBot, (state) => ({
        ...state,
        bots: [...state.bots, {
            ...BASIC_BOT,
            name: 'basic ' + (state.bots.length + 1)
        }]
    })),
    on(updateBotCode, (state, {name, code}) => ({
        ...state,
        bots: [...state.bots.filter(b => b.name !== name), {...(state.bots.find(b => b.name === name) ?? BASIC_BOT), code: code }]
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

export const selectPlayerData = createSelector(
    selectPlayerState, 
    (state: PlayerState) => ({
        ...state
    } as PlayerData)
)