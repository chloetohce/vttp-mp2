export interface Code {
    code: string,
    context: Context
}

export interface Context {
    stage: number | undefined,
}