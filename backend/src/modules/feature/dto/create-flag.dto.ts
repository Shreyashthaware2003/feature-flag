import { IsString, IsOptional, IsBoolean, IsIn, IsNumber } from 'class-validator';

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
    value?: any;

    @IsOptional()
    @IsNumber()
    rollout_percentage?: number;

    @IsOptional()
    @IsIn(['AND', 'OR'])
    rule_type?: 'AND' | 'OR';
}