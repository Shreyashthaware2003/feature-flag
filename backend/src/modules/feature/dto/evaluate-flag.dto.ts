import { IsString, IsObject } from 'class-validator';

export class EvaluateDto {
    @IsString()
    flagKey!: string;

    @IsObject()
    user!: Record<string, any>;
}