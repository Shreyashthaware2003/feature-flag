export interface User {
    id?: string;
    email?: string;
    [key: string]: any;
}
export interface EvaluateResponse {
    enabled: boolean;
    variant?: string;
    config?: any;
    reason?: string;
}
