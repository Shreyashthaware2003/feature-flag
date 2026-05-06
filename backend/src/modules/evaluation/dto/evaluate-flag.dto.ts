import { IsObject, IsString } from 'class-validator';

export type UserContext = Record<
  string,
  string | number | boolean | Array<string | number | boolean>
>;

export class EvaluateDto {
  @IsString()
  flagKey!: string;

  @IsObject()
  user!: UserContext;
}
