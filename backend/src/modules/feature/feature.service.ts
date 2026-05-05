import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FeatureFlag } from '../evaluation/entity/feature-flag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFlagDto } from './dto/create-flag.dto';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(FeatureFlag)
    private readonly flagRepo: Repository<FeatureFlag>,
  ) {}

  async create(dto: CreateFlagDto) {
    const flag = this.flagRepo.create(dto);
    return this.flagRepo.save(flag);
  }

  async findAll() {
    return this.flagRepo.find({ relations: ['rules', 'variants'] });
  }

  async update(id: string, dto: any) {
    await this.flagRepo.update(id, dto);
    return this.flagRepo.findOne({ where: { id } });
  }

  async delete(id: string) {
    return this.flagRepo.delete(id);
  }

  async getFlagWithRules(flagKey: string): Promise<FeatureFlag | null> {
    return this.flagRepo.findOne({
      where: { flag_key: flagKey },
      relations: ['rules'],
    });
  }
}
