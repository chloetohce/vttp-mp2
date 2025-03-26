import { ActionCreator, GameAction } from "./dialogue.model"

export interface PlayerData {
    username: string,
    stage: number,
    day: number,
    gold: number,
    hp: number,
    energy: number,
    items: Item[],
    bots: Bot[]
}

export interface Bot {
    name: string,
    type: string,
    calls: number,
    id: number,
    code: string
}

export interface Item {
    name: string,
    desc: string,
    effect: GameAction
}

export interface MapLocation {
    name: string, 
    x: number,
    y: number,
    npc: string,
    desc: string,
    key: string
}