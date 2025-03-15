import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from "../../services/authentication/auth.service";
import { clearTokens, loadTokens, loadTokensSuccess, refreshToken, setRefreshToken, setToken } from "./auth.actions";
import { catchError, EMPTY, first, map, mergeMap, of, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";

@Injectable()
export class AuthEffects {
    private actions$: Actions = inject(Actions);

    private authService: AuthService = inject(AuthService)

    // For setTokens
    setToken$ = createEffect(() => 
        this.actions$.pipe(
            ofType(setToken),
            tap((auth) => {
                localStorage.setItem("token", auth.token)
            })
        ),
        {dispatch: false}
    )

    // For setTokens
    setRefreshToken$ = createEffect(() => 
        this.actions$.pipe(
            ofType(setRefreshToken),
            tap((auth) => {
                localStorage.setItem("refreshToken", auth.refreshToken)
            })
        ),
        {dispatch: false}
    )

    // Listen for refreshToken
    refreshToken$ = createEffect(() =>
        this.actions$.pipe(
            ofType(refreshToken),
            switchMap(() => 
                this.authService.refreshToken()
                    .pipe(
                        map((response) => setToken({token: response.token})),
                        catchError(() => {
                            return of(clearTokens())
                        })
                    )
        
            )
        )
    )

    // Listen for loadTokens
    // Get the tokens from their storage and update the store.
    loadTokens$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadTokens), 
            map((auth) => {
                const token = localStorage.getItem('token');
                const refreshToken = localStorage.getItem('refreshToken');
                return loadTokensSuccess({token: token, refreshToken: refreshToken})
            })
        )
    )


}