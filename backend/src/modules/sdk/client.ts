import axios from "axios";
import type { User, EvaluateResponse } from "./types.js";

export class FeatureSDK {
  private apiUrl: string;
  private accessKey?: string;
  private accessToken?: string;

  constructor(options: {
    apiUrl: string;
    accessKey?: string;
    accessToken?: string;
  }) {
    this.apiUrl = options.apiUrl;
    this.accessKey = options.accessKey;
    this.accessToken = options.accessToken;
  }

  setAccessKey(key: string) {
    this.accessKey = key;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  async evaluate(flagKey: string, user: User): Promise<EvaluateResponse> {
    const headers: Record<string, string> = {};
    if (this.accessKey) {
      headers["x-access-key"] = this.accessKey;
    } else if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await axios.post(
      `${this.apiUrl}/evaluate`,
      { flagKey, user },
      {
        headers: Object.keys(headers).length > 0 ? headers : undefined,
      }
    );
    return response.data;
  }

  async isEnabled(flagKey: string, user: User): Promise<boolean> {
    const res = await this.evaluate(flagKey, user);
    return res.enabled;
  }

  async getConfig(flagKey: string, user: User): Promise<any> {
    const res = await this.evaluate(flagKey, user);
    return res.enabled ? (res.config ?? null) : null;
  }
}
