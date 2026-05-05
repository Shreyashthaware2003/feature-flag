export type EvaluateRequest = {
  flagKey: string;
  user: Record<string, string | number | boolean | Array<string | number | boolean>>;
};

export type EvaluateResponse = {
  enabled: boolean;
  variant?: string;
  config?: Record<string, unknown> | null;
  reason?: string;
};

export type EvaluationState = {
  result: EvaluateResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};
