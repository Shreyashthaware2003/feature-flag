import axios from "axios";
import { User, EvaluateResponse } from "./types";

export class FeatureSDK {
    private apiUrl: string;

    constructor(options: { apiUrl: string }) {
        this.apiUrl = options.apiUrl;
    }

    async evaluate(flagKey: string, user: User): Promise<EvaluateResponse> {
        const response = await axios.post(`${this.apiUrl}/evaluate`, {
            flagKey,
            user,
        });

        return response.data;
    }

    async isEnabled(flagKey: string, user: User): Promise<boolean> {
        const res = await this.evaluate(flagKey, user);
        return res.enabled;
    }

    async getConfig(flagKey: string, user: User): Promise<any> {
        const res = await this.evaluate(flagKey, user);
        if (!res.enabled) return null; // 👈 FIX

        return res.config || null;
    }
}