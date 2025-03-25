import { DialogueNode } from "../../model/dialogue.model";
import { BehaviorSubject } from "rxjs";
import { ActionMapperService } from "./action-mapper.service";
import { EventBus } from "../../components/game/bootstrap/eventbus";

export class DialogueManager {
    private actionMapper;
    private dialogueData: Record<string, DialogueNode>;
    private currentNode: DialogueNode | null = null;

    private currentNodeSubject = new BehaviorSubject<DialogueNode | null>(null)
    public currentNode$ = this.currentNodeSubject.asObservable();

    constructor(data: Record<string, DialogueNode>, actionMapper: ActionMapperService) {
        this.dialogueData = data;
        this.actionMapper = actionMapper
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
            const currChoiceNode = this.currentNode.choices[choiceIndex]
            if (currChoiceNode.effect) {
                for (const e of currChoiceNode.effect) {
                    console.log(e.payload)
                    this.actionMapper.dispatchActionString(e.type, e.payload)
                }

            }
            
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
            EventBus.emit('dialogue-end')
            return null;
        }
        
        // Base case
        this.currentNode = this.dialogueData[nextNodeKey];
        this.currentNodeSubject.next(this.currentNode);
        return this.currentNode;
    }

    getCurrentChoices() {
        return this.currentNode?.choices?.filter(choice => {
            if (!choice.condition) 
                return true;
            else {
                return this.actionMapper.evaluateCondition(choice.condition.key)(choice.condition.payload)
            }
        }) || []
    }

    isChoicesAvailable(): boolean {
        return !!(this.currentNode && this.currentNode.choices && this.currentNode.choices.length > 0);
    }
    
}