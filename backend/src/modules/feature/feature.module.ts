import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureFlag } from '../evaluation/entity/feature-flag.entity';
import { Rule } from '../evaluation/entity/rule.entity';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';
import { Variant } from '../evaluation/entity/variant.entity';
import { TrackingModule } from '../tracking/tracking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeatureFlag, Rule, Variant]),
    TrackingModule,
  ],
  exports: [FeatureService],
  providers: [FeatureService],
  controllers: [FeatureController],
})
export class FeatureModule {}
