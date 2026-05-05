import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FeatureFlag } from '../evaluation/entity/feature-flag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFlagDto } from './dto/create-flag.dto';
import { TrackingService } from '../tracking/tracking.service';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(FeatureFlag)
    private readonly flagRepo: Repository<FeatureFlag>,
    private readonly trackingService: TrackingService,
  ) {}

  async create(dto: CreateFlagDto, userId: string) {
    const flag = this.flagRepo.create({ ...dto, createdById: userId });
    const created = await this.flagRepo.save(flag);

    await this.trackingService.track({
      userId,
      eventType: 'create_flag',
      flagKey: created.flag_key,
      metadata: {
        enabled: created.enabled,
        rolloutPercentage: created.rollout_percentage,
      },
    });

    return created;
  }

  async findAll(userId: string) {
    return this.flagRepo.find({
      where: { createdById: userId },
      relations: ['rules', 'variants'],
    });
  }

  async update(id: string, dto: any, userId: string) {
    await this.flagRepo.update({ id, createdById: userId }, dto);
    const updated = await this.flagRepo.findOne({
      where: { id, createdById: userId },
    });

    if (updated) {
      await this.trackingService.track({
        userId,
        eventType: 'update_flag',
        flagKey: updated.flag_key,
        metadata: {
          updatedFields: Object.keys(dto),
        },
      });
    }

    return updated;
  }

  async delete(id: string, userId: string) {
    const existing = await this.flagRepo.findOne({
      where: { id, createdById: userId },
      select: ['id', 'flag_key'],
    });

    const result = await this.flagRepo.delete({ id, createdById: userId });

    if (existing && result.affected) {
      await this.trackingService.track({
        userId,
        eventType: 'delete_flag',
        flagKey: existing.flag_key,
      });
    }

    return result;
  }

  async getFlagWithRules(
    flagKey: string,
    userId: string,
  ): Promise<FeatureFlag | null> {
    return this.flagRepo.findOne({
      where: { flag_key: flagKey, createdById: userId },
      relations: ['rules', 'variants'],
    });
  }
}
