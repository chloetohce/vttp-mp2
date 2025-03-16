import { DialogueNode } from "../../model/dialogue.model";
import { BehaviorSubject, map, tap } from "rxjs";

export class DialogueManager {
    private dialogueData: Record<string, DialogueNode>;
    private currentNode: DialogueNode | null = null;

    private currentNodeSubject = new BehaviorSubject<DialogueNode | null>(null)
    public currentNode$ = this.currentNodeSubject.asObservable();

    constructor(data: Record<string, DialogueNode>) {
        this.dialogueData = data;
    }
    
    // loadDialogue(key: string) {
    //     this.http.get<Record<string, DialogueNode>>(`assets/dialogues/${key}.json`)
    //         .pipe(
    //             tap(data => this.dialogueData = data)
    //         )
    // }

    start() {
        this.currentNode = this.dialogueData["start"];
        this.currentNodeSubject.next(this.currentNode);
    }

    /**
     * Query to serve next dialogue option
     * @param choiceIndex when choosing user input dialogue
     */
    next(choiceIndex?: number): DialogueNode | null {
        if (!this.currentNode) {
            return null;
        }

        let nextNodeKey: string | undefined;

        // If choices exist and a choice index is provided
        if (this.currentNode.choices && choiceIndex !== undefined && this.currentNode.choices[choiceIndex]) {
            nextNodeKey = this.currentNode.choices[choiceIndex].next;
        } else {
            // May be undefined here
            // TODO: test if value will be undefined or null if value is not provided at all
            nextNodeKey = this.currentNode.next;
        }

        // If there is no more next node, end the dialogue
        if (!nextNodeKey) {
            this.currentNode = null;
            // TODO: Is completing it the same as sending null?
            this.currentNodeSubject.next(null)
            return null;
        }
        
        // Base case
        this.currentNode = this.dialogueData[nextNodeKey];
        this.currentNodeSubject.next(this.currentNode);
        return this.currentNode;
    }

    getCurrentChoices() {
        return this.currentNode?.choices || []
    }

    isChoicesAvailable(): boolean {
        return !!(this.currentNode && this.currentNode.choices && this.currentNode.choices.length > 0);
    }
    
}