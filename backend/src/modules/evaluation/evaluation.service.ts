import { Injectable, NotFoundException } from '@nestjs/common';
import { FeatureService } from '../feature/feature.service';

@Injectable()
export class EvaluationService {
    constructor(private readonly featureService: FeatureService) { }

    async evaluate(flagKey: string, user: any) {
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

        return {
            enabled: true,
            variant,
        };
    }

    private isFeatureEnabled(flag: any, user: any): boolean {
        if (!flag.enabled) return false;

        const rulesMatch = this.evaluateRules(flag.rules, user);
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

    private evaluateRules(rules: any[], user: any): boolean {
        if (!rules || rules.length === 0) return true;

        return rules.every(rule => {
            const userValue = user[rule.field];

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
        });
    }

    private evaluateRollout(flag: any, user: any): boolean {
        const percentage = flag.rollout_percentage || 0;

        const hash = this.hash(`${user.id}:${flag.flag_key}`);

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