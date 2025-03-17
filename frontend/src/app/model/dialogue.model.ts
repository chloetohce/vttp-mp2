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
    // condition?: () => boolean;
}
