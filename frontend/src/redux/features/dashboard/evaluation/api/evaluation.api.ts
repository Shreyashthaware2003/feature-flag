import type {
  EvaluateRequest,
  EvaluateResponse,
} from "../evaluation.types";
import { api } from "@/lib/api";

export async function evaluateFlagApi(
  accessToken: string,
  payload: EvaluateRequest,
): Promise<EvaluateResponse> {
  return api.post<EvaluateResponse>("/evaluate", payload, {
    token: accessToken,
  });
}
