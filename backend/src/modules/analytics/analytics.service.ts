import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackingEvent } from '../tracking/entities/tracking-event.entity';
import { FeatureFlag } from '../evaluation/entity/feature-flag.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(TrackingEvent)
    private readonly trackingRepo: Repository<TrackingEvent>,
    @InjectRepository(FeatureFlag)
    private readonly featureFlagRepo: Repository<FeatureFlag>,
  ) {}

  async getSummary(userId: string) {
    const totalFlags = await this.featureFlagRepo.count({
      where: { createdById: userId },
    });

    const liveRollouts = await this.featureFlagRepo.count({
      where: {
        createdById: userId,
        enabled: true,
      },
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const evaluationsToday = await this.trackingRepo
      .createQueryBuilder('event')
      .where('event.userId = :userId', { userId })
      .andWhere('event.eventType = :eventType', { eventType: 'evaluate_flag' })
      .andWhere('event.createdAt >= :startOfToday', { startOfToday })
      .getCount();

    return {
      totalFlags,
      liveRollouts,
      evaluationsToday,
    };
  }

  async getActivity(userId: string) {
    const events = await this.trackingRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return events.map((event) => ({
      id: event.id,
      eventType: event.eventType,
      flagKey: event.flagKey,
      metadata: event.metadata,
      createdAt: event.createdAt,
    }));
  }
}
