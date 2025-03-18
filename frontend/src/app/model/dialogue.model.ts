import { Action } from "@ngrx/store";

export interface DialogueNode {
    text: string;
    choices?: DialogueChoice[];
    next?: string;
    // onEnter?: () => void;
    // onExit?: () => void;
}

export interface DialogueChoice {
    text: string;
    next: string;
    condition?: {key: string, payload: any};
    effect?: GameAction[]
}

export interface GameAction {
    type: string;
    payload?: any;
    action?: ActionCreator;
}

export type ActionCreator = (payload?: any) => Action