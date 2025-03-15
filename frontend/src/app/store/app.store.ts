import { AuthState } from "./authentication/auth.store";
import { PlayerState } from "./player/player.store";

export interface AppState {
    auth: AuthState,
    player: PlayerState
}