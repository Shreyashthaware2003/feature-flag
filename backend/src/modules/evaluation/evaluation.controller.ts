import { Body, Controller, Post } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluateDto } from './dto/evaluate-flag.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { type AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('evaluate')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  async evaluateFeature(
    @Body() body: EvaluateDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    const { flagKey, user } = body;

    return this.evaluationService.evaluate(flagKey, user, actor.userId);
  }
}
