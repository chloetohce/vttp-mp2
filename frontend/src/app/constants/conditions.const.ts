import { inject, Injectable, OnDestroy } from "@angular/core"
import { Store } from "@ngrx/store"
import { getPlayerData } from "../store/player/player.action"
import { selectEnergy, selectGold } from "../store/player/player.store"
import { firstValueFrom, Subscription } from "rxjs"

@Injectable({
    providedIn: 'root'
})
export class ConditionsHolder implements OnDestroy {
    private store = inject(Store)
    
    private currGold = 0;
    private currEnergy = 10

    private goldSub!: Subscription
    private energySub!: Subscription

    constructor() {
        this.goldSub = this.store.select(selectGold)
            .subscribe(g => this.currGold = g)
        this.energySub = this.store.select(selectEnergy)
            .subscribe(e => this.currEnergy = e)
    }

    CONDITIONS: Record<string, (payload?: any) => boolean> = {
        "TEST": (payload) => payload,
        "GOLD": (payload: number) => {
            return  this.currGold >= payload

        },
        "ENERGY": (payload: number) => this.currEnergy >= payload

    }

    ngOnDestroy(): void {
        this.goldSub.unsubscribe()
        this.energySub.unsubscribe()
    }
}
