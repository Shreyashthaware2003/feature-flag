import type {
  EvaluateRequest,
  EvaluateResponse,
} from "../evaluation.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/api/v1";

export async function evaluateFlagApi(
  payload: EvaluateRequest,
): Promise<EvaluateResponse> {
  const response = await fetch(`${API_BASE_URL}/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to evaluate flag (${response.status})`);
  }

  return (await response.json()) as EvaluateResponse;
}
