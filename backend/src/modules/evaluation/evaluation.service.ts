import { Injectable, NotFoundException } from '@nestjs/common';
import { FeatureService } from '../feature/feature.service';
import { UserContext } from './dto/evaluate-flag.dto';
import { FeatureFlag } from './entity/feature-flag.entity';
import { Rule } from './entity/rule.entity';
import { Variant } from './entity/variant.entity';
import { TrackingService } from '../tracking/tracking.service';

type EvaluationResult = {
  enabled: boolean;
  variant?: string;
  config?: unknown;
  reason?: string;
};

@Injectable()
export class EvaluationService {
  constructor(
    private readonly featureService: FeatureService,
    private readonly trackingService: TrackingService,
  ) {}

  async evaluate(
    flagKey: string,
    user: UserContext,
    actorUserId: string,
  ): Promise<EvaluationResult> {
    const flag = await this.featureService.getFlagWithRules(
      flagKey,
      actorUserId,
    );

    if (!flag) {
      throw new NotFoundException('Feature flag not found');
    }

    const enabled = this.isFeatureEnabled(flag, user);

    let result: EvaluationResult;
    if (!enabled) {
      result = {
        enabled: false,
        reason: 'Flag disabled by rule or rollout check',
      };
    } else {
      const variant = this.getVariant(flag, user);
      if (flag.type === 'config') {
        result = {
          enabled,
          variant,
          config: enabled ? flag.value : null,
          reason: 'Flag enabled with config payload',
        };
      } else {
        result = { enabled, variant, reason: 'Flag enabled' };
      }
    }

    await this.trackingService.track({
      userId: actorUserId,
      eventType: 'evaluate_flag',
      flagKey,
      metadata: {
        enabled: result.enabled,
        variant: result.variant ?? null,
      },
    });

    return result;
  }

  private isFeatureEnabled(flag: FeatureFlag, user: UserContext): boolean {
    if (!flag.enabled) return false;

    const rulesMatch = this.evaluateRules(flag, user);
    if (!rulesMatch) return false;

    return this.evaluateRollout(flag, user);
  }

  private getVariant(flag: FeatureFlag, user: UserContext): string {
    const variants = flag.variants as Variant[] | undefined;

    if (!variants || variants.length === 0) {
      return 'default';
    }

    const identifier = this.getIdentifier(user);
    const hash = this.hash(`${identifier}:${flag.flag_key}`);
    const bucket = hash % 100;

    let cumulative = 0;
    for (const variant of variants) {
      cumulative += variant.weight;
      if (bucket < cumulative) {
        return variant.name;
      }
    }

    return variants[0].name;
  }

  private evaluateRules(flag: FeatureFlag, user: UserContext): boolean {
    const rules = flag.rules as Rule[] | undefined;
    if (!rules || rules.length === 0) return true;

    if (flag.rule_type === 'OR') {
      return rules.some((rule) => this.evaluateSingleRule(rule, user));
    }

    return rules.every((rule) => this.evaluateSingleRule(rule, user));
  }

  private evaluateSingleRule(rule: Rule, user: UserContext): boolean {
    const key = rule.field;
    const userValue = user[key];

    if (userValue === undefined || userValue === null) {
      return false;
    }

    switch (rule.operator) {
      case 'equals':
        return String(userValue) === rule.value;
      case 'not_equals':
        return String(userValue) !== rule.value;
      case 'greater_than':
        return Number(userValue) > Number(rule.value);
      case 'greater_than_equal':
        return Number(userValue) >= Number(rule.value);
      case 'less_than':
        return Number(userValue) < Number(rule.value);
      case 'less_than_equal':
        return Number(userValue) <= Number(rule.value);
      case 'includes':
        return Array.isArray(userValue)
          ? userValue.map(String).includes(rule.value)
          : String(userValue).includes(rule.value);
      default:
        return false;
    }
  }

  private evaluateRollout(flag: FeatureFlag, user: UserContext): boolean {
    const percentage = flag.rollout_percentage ?? 100;
    if (percentage <= 0) return false;
    if (percentage >= 100) return true;

    const identifier = this.getIdentifier(user);
    const hash = this.hash(`${identifier}:${flag.flag_key}`);
    return hash % 100 < percentage;
  }

  private getIdentifier(user: UserContext): string {
    const id = user.id;
    const email = user.email;
    if (typeof id === 'string' || typeof id === 'number') return String(id);
    if (typeof email === 'string') return email;
    return 'anonymous';
  }

  private hash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
