import type { User, EvaluateResponse } from "./types.js";
export declare class FeatureSDK {
    private apiUrl;
    private accessKey?;
    private accessToken?;
    constructor(options: {
        apiUrl: string;
        accessKey?: string;
        accessToken?: string;
    });
    setAccessKey(key: string): void;
    setAccessToken(token: string): void;
    evaluate(flagKey: string, user: User): Promise<EvaluateResponse>;
    isEnabled(flagKey: string, user: User): Promise<boolean>;
    getConfig(flagKey: string, user: User): Promise<any>;
}
