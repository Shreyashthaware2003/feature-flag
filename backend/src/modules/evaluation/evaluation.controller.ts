import { Body, Controller, Post } from "@nestjs/common";
import { EvaluationService } from "./evaluation.service";

@Controller('evaluate')
export class EvaluationController {
    constructor(private readonly evaluationService: EvaluationService) { }
    
    @Post()
    async evaluateFeature(@Body() body: any) {
        const { flagKey, user } = body;

        return this.evaluationService.evaluate(flagKey, user);
    }
}