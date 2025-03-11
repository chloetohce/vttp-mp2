export interface User {
    username: string,
    email: string,
    password: string
}

export interface AuthResponse {
    token: string,
    refreshToken: string,
    exp: number
}