import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { getPlayerData, getPlayerDataFailure, setPlayerData } from "./player.action";
import { catchError, map, mergeMap, of, switchMap, tap } from "rxjs";
import { PlayerService } from "../../services/player.service";

@Injectable()
export class PlayerEffects {
    private actions$: Actions = inject(Actions)
    private playerService = inject(PlayerService);
    
    getPlayerData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(getPlayerData),
            switchMap((action) => {
                return this.playerService.getPlayerData(action.username).pipe(
                    tap(r => console.log(r)),
                    map((r) => setPlayerData({data: r})),
                    catchError((error) => of(getPlayerDataFailure({error: error})))
                )
            })
        )
    )

    
}