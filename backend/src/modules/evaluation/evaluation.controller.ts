import { Body, Controller, Post } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluateDto } from './dto/evaluate-flag.dto';

@Controller('evaluate')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  async evaluateFeature(@Body() body: EvaluateDto) {
    const { flagKey, user } = body;

    return this.evaluationService.evaluate(flagKey, user);
  }
}
