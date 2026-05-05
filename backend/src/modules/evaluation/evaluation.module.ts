import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureFlag } from './entity/feature-flag.entity';
import { Rule } from './entity/rule.entity';
import { Variant } from './entity/variant.entity';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { FeatureModule } from '../feature/feature.module';
import { TrackingModule } from '../tracking/tracking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeatureFlag, Rule, Variant]),
    FeatureModule,
    TrackingModule,
  ],
  providers: [EvaluationService],
  controllers: [EvaluationController],
  exports: [EvaluationService],
})
export class EvaluationModule {}
