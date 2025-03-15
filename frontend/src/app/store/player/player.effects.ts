import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { getPlayerData } from "./player.action";
import { HttpClient } from "@angular/common/http";
import { PLAYER_URL } from "../../constants/url";

@Injectable()
export class PlayerEffects {
    private actions$: Actions = inject(Actions)
    private http = inject(HttpClient)
    
    getPlayerData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(getPlayerData),
            
        )
    )
}