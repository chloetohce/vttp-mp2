import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { endDay, endDaySuccess, gainBot, getPlayerData, getPlayerDataFailure, restart, setPlayerData } from "./player.action";
import { catchError, map, mergeMap, of, switchMap, tap, withLatestFrom } from "rxjs";
import { PlayerService } from "../../services/player.service";
import { HttpClient } from "@angular/common/http";
import { PlayerState, selectPlayerState } from "./player.store";
import { PlayerData } from "../../model/player-data.model";
import { Store } from "@ngrx/store";
import { GameStateService } from "../../services/game/game-state.service";

@Injectable()
export class PlayerEffects {
    private actions$: Actions = inject(Actions)
    private playerService = inject(PlayerService);
    private gameService = inject(GameStateService)
    private store = inject(Store)
    
    getPlayerData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(getPlayerData),
            switchMap((action) => {
                return this.playerService.getPlayerData(action.username).pipe(
                    map((r) => setPlayerData({data: r})),
                    catchError((error) => of(getPlayerDataFailure({error: error})))
                )
            })
        )
    )

    endDay$ = createEffect(() => 
        this.actions$.pipe(
            ofType(endDay),
            withLatestFrom(this.store.select(selectPlayerState)),
            switchMap(([action, gameState]) => {
                const state: PlayerState = gameState as PlayerState;
                return this.playerService.updatePlayerData(state)
                    .pipe(
                        map(() => endDaySuccess())
                    )
            })
        )
    )

    restart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(restart),
            tap(action => {
                this.gameService.reset(action.username)
            })
        ),
        {dispatch: false}
    )

}