import { createAction, props } from '@ngrx/store';

export const setToken = createAction(
    '[Auth] Set Token', 
    props<{token: string}>()
);

export const setRefreshToken = createAction(
    '[Auth] Set Refresh Token', 
    props<{refreshToken: string}>()
);

export const clearTokens = createAction(
    '[Auth] Clear Tokens'
)

export const setLoggedIn = createAction(
    '[Auth] Set Logged In',
    props<{isLoggedIn: boolean}>()
)

export const refreshToken = createAction('[Auth] Refresh Token')

export const refreshTokenSuccess = createAction(
    '[Auth] Refresh Token Success',
    props<{token: string; refreshToken: string}>()
)

export const loadTokens = createAction(
    '[Auth] Load Tokens'
)

export const loadTokensSuccess = createAction(
    '[Auth] Load Tokens Success',
    props<{token: string | null; refreshToken: string | null}>()
)