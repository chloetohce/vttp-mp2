import { inject, Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { getPlayerData } from "../store/player/player.action"

@Injectable({
    providedIn: 'root'
})
export class ConditionsHolder {
    private store = inject(Store)

    static CONDITIONS: Record<string, (payload?: any) => boolean> = {
        "TEST": (payload) => payload
    }
}
