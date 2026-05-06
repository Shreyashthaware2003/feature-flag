import { Body, Controller, Post, Req, UnauthorizedException } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluateDto } from './dto/evaluate-flag.dto';
import { Public } from '../auth/decorators/public.decorator';
import { AccessKeysService } from '../access-keys/access-keys.service';
import { AuthService } from '../auth/auth.service';

type EvaluateRequest = {
  headers: {
    authorization?: string;
    'x-access-key'?: string;
  };
};

@Controller('evaluate')
export class EvaluationController {
  constructor(
    private readonly evaluationService: EvaluationService,
    private readonly accessKeysService: AccessKeysService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post()
  async evaluateFeature(@Body() body: EvaluateDto, @Req() req: EvaluateRequest) {
    const { flagKey, user } = body;
    const accessKey = req.headers['x-access-key'];
    if (accessKey) {
      const ownerUserId =
        await this.accessKeysService.resolveOwnerByAccessKey(accessKey);
      return this.evaluationService.evaluate(flagKey, user, ownerUserId);
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : null;

    if (!token) {
      throw new UnauthorizedException(
        'Provide either bearer token or x-access-key',
      );
    }

    const actor = await this.authService.validateAccessToken(token);
    return this.evaluationService.evaluate(flagKey, user, actor.userId);
  }
}
