export type RuleType = "AND" | "OR";
export type FlagType = "boolean" | "config";

export type Rule = {
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "greater_than"
    | "greater_than_equal"
    | "less_than"
    | "less_than_equal"
    | "includes";
  value: string;
};

export type Variant = {
  name: string;
  weight: number;
};

export type FeatureFlag = {
  id: string;
  flag_key: string;
  enabled: boolean;
  type: FlagType;
  value?: Record<string, unknown> | null;
  rollout_percentage?: number;
  rule_type?: RuleType;
  rules?: Rule[];
  variants?: Variant[];
};

export type CreateFlagPayload = {
  flag_key: string;
  enabled?: boolean;
  type?: FlagType;
  value?: Record<string, unknown>;
  rollout_percentage?: number;
  rule_type?: RuleType;
  rules?: Rule[];
  variants?: Variant[];
};

export type FlagsState = {
  items: FeatureFlag[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};
