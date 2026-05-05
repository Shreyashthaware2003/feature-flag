import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TrackingEvent,
  TrackingEventType,
} from './entities/tracking-event.entity';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(TrackingEvent)
    private readonly trackingRepo: Repository<TrackingEvent>,
  ) {}

  async track(params: {
    userId: string;
    eventType: TrackingEventType;
    flagKey?: string | null;
    metadata?: Record<string, unknown> | null;
  }): Promise<TrackingEvent> {
    const event = this.trackingRepo.create({
      userId: params.userId,
      eventType: params.eventType,
      flagKey: params.flagKey ?? null,
      metadata: params.metadata ?? null,
    });

    return this.trackingRepo.save(event);
  }
}
