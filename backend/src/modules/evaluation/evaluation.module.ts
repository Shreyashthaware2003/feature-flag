import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeatureFlag } from "./entity/feature-flag.entity";
import { Rule } from "./entity/rule.entity";
import { EvaluationService } from "./evaluation.service";
import { EvaluationController } from "./evaluation.controller";
import { FeatureModule } from "../feature/feature.module";

@Module({
    imports: [TypeOrmModule.forFeature([FeatureFlag, Rule]),FeatureModule],
    providers: [EvaluationService],
    controllers: [EvaluationController]
})

export class EvaluationModule { }