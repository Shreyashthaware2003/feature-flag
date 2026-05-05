import { Injectable, NotFoundException } from '@nestjs/common';
import { FeatureService } from '../feature/feature.service';
import { UserContext } from './dto/evaluate-flag.dto';
import { FeatureFlag } from './entity/feature-flag.entity';

@Injectable()
export class EvaluationService {
  constructor(private readonly featureService: FeatureService) {}

  async evaluate(flagKey: string, user: UserContext) {
    // 1. Fetch from DB
    const flag = await this.featureService.getFlagWithRules(flagKey);

    if (!flag) {
      throw new NotFoundException('Feature flag not found');
    }

    // 2. Run evaluation
    const enabled = this.isFeatureEnabled(flag, user);

    if (!enabled) {
      return { enabled: false };
    }

    const variant = this.getVariant(flag, user);

    if (flag.type === 'boolean') {
      return { enabled, variant };
    }

    if (flag.type === 'config') {
      return {
        enabled,
        variant,
        config: enabled ? flag.value : null,
      };
    }

    return { enabled, variant };
  }

  private isFeatureEnabled(flag: FeatureFlag, user: UserContext): boolean {
    if (!flag.enabled) return false;

    const rulesMatch = this.evaluateRules(flag, user);
    if (!rulesMatch) return false;

    return this.evaluateRollout(flag, user);
  }

  private getVariant(flag: any, user: any): string {
    const variants = flag.variants;

    if (!variants || variants.length === 0) {
      return 'default';
    }

    const hash = this.hash(`${user.id}:${flag.flag_key}`);
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
    const rules = flag.rules;

    if (!rules || rules.length === 0) return true;

    if (flag.rule_type === 'OR') {
      return rules.some((rule) => this.evaluateSingleRule(rule, user));
    }

    return rules.every((rule) => this.evaluateSingleRule(rule, user));
  }

  private evaluateSingleRule(rule: any, user: any): boolean {
    const userValue = user[rule.field];

    if (userValue === undefined || userValue === null) {
      return false;
    }

    switch (rule.operator) {
      case 'equals':
        return userValue === rule.value;

      case 'not_equals':
        return userValue !== rule.value;

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
          ? userValue.includes(rule.value)
          : String(userValue).includes(rule.value);

      default:
        return false;
    }
  }

  private evaluateRollout(flag: any, user: any): boolean {
    const percentage = flag.rollout_percentage ?? 100;

    if (percentage <= 0) return false;
    if (percentage >= 100) return true;

    const identifier = user?.id || user?.email || 'anonymous';
    const hash = this.hash(`${identifier}:${flag.flag_key}`);

    return hash % 100 < percentage;
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
