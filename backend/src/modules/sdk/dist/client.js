import axios from "axios";
export class FeatureSDK {
    constructor(options) {
        this.apiUrl = options.apiUrl;
        this.accessKey = options.accessKey;
        this.accessToken = options.accessToken;
    }
    setAccessKey(key) {
        this.accessKey = key;
    }
    setAccessToken(token) {
        this.accessToken = token;
    }
    async evaluate(flagKey, user) {
        const headers = {};
        if (this.accessKey) {
            headers["x-access-key"] = this.accessKey;
        }
        else if (this.accessToken) {
            headers.Authorization = `Bearer ${this.accessToken}`;
        }
        const response = await axios.post(`${this.apiUrl}/evaluate`, { flagKey, user }, {
            headers: Object.keys(headers).length > 0 ? headers : undefined,
        });
        return response.data;
    }
    async isEnabled(flagKey, user) {
        const res = await this.evaluate(flagKey, user);
        return res.enabled;
    }
    async getConfig(flagKey, user) {
        const res = await this.evaluate(flagKey, user);
        return res.enabled ? (res.config ?? null) : null;
    }
}
