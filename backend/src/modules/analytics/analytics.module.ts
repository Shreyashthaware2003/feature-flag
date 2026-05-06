import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TrackingEvent } from '../tracking/entities/tracking-event.entity';
import { FeatureFlag } from '../evaluation/entity/feature-flag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrackingEvent, FeatureFlag])],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
