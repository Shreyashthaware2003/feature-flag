import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class RuleDto {
  @IsString()
  field!: string;

  @IsIn([
    'equals',
    'not_equals',
    'greater_than',
    'greater_than_equal',
    'less_than',
    'less_than_equal',
    'includes',
  ])
  operator!:
    | 'equals'
    | 'not_equals'
    | 'greater_than'
    | 'greater_than_equal'
    | 'less_than'
    | 'less_than_equal'
    | 'includes';

  @IsString()
  value!: string;
}

export class VariantDto {
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  weight!: number;
}

export class CreateFlagDto {
  @IsString()
  flag_key!: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsIn(['boolean', 'config'])
  type?: 'boolean' | 'config';

  @IsOptional()
  @IsObject()
  value?: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  rollout_percentage?: number;

  @IsOptional()
  @IsIn(['AND', 'OR'])
  rule_type?: 'AND' | 'OR';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RuleDto)
  rules?: RuleDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants?: VariantDto[];
}
