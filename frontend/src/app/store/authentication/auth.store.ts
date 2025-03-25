import { createReducer, createSelector, on } from "@ngrx/store"
import { clearTokens, loadTokensSuccess, setLoggedIn, setRefreshToken, setToken } from "./auth.actions"
import { jwtDecode } from "jwt-decode"

export interface AuthState {
    isLoggedIn: boolean,
    token: string | null,
    refreshToken: string | null
}

export const initialAuthState: AuthState = {
    isLoggedIn: false,
    token: null,
    refreshToken: null
}

export const authReducer = createReducer(
    initialAuthState,
    on(setToken, (state, {token}) => ({
        ...state,
        token
    })),
    on(setRefreshToken, (state, {refreshToken}) => ({
        ...state,
        refreshToken
    })), 
    on(clearTokens, (state) => ({
        ...state,
        token: null,
        refreshToken: null,
        isLoggedIn: false
    })),
    on(setLoggedIn, (state, {isLoggedIn}) => ({
        ...state,
        isLoggedIn
    })),
    on(loadTokensSuccess, (state, {token, refreshToken}) => ({
        ...state,
        token: token,
        refreshToken: refreshToken
    }))
)

// Selectors
export const selectAuthState = (state: {auth: AuthState}) => state.auth

export const selectIsLoggedIn = createSelector(
    selectAuthState,
    (state: AuthState) => state.isLoggedIn
);

export const selectToken = createSelector(
    selectAuthState,
    (state: AuthState): string | null => state.token
)

export const selectRefreshToken = createSelector(
    selectAuthState,
    (state: AuthState) => state.refreshToken
)

export const selectUsername = createSelector(
    selectAuthState,
    (state: AuthState) => jwtDecode(state.refreshToken ?? '').sub ?? ''
)