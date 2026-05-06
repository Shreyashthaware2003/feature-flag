import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAccessKeyDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;
}
