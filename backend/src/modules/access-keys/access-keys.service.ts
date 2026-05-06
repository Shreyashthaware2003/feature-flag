import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { compare, hash } from 'bcryptjs';
import { AccessKey } from './entities/access-key.entity';

type CreatedAccessKey = {
  id: string;
  name: string;
  accessKey: string;
  prefix: string;
  last4: string;
  createdAt: Date;
};

@Injectable()
export class AccessKeysService {
  constructor(
    @InjectRepository(AccessKey)
    private readonly accessKeyRepo: Repository<AccessKey>,
  ) {}

  async create(ownerUserId: string, name?: string): Promise<CreatedAccessKey> {
    const rawKey = this.generateRawAccessKey();
    const keyHash = await hash(rawKey, 10);
    const prefix = rawKey.split('_').slice(0, 2).join('_');
    const last4 = rawKey.slice(-4);

    const entity = this.accessKeyRepo.create({
      ownerUserId,
      keyHash,
      prefix,
      last4,
      name: name?.trim() || 'Default Key',
      isActive: true,
      revokedAt: null,
      lastUsedAt: null,
    });

    const created = await this.accessKeyRepo.save(entity);

    return {
      id: created.id,
      name: created.name,
      accessKey: rawKey,
      prefix: created.prefix,
      last4: created.last4,
      createdAt: created.createdAt,
    };
  }

  async list(ownerUserId: string) {
    const keys = await this.accessKeyRepo.find({
      where: { ownerUserId },
      order: { createdAt: 'DESC' },
    });

    return keys.map((key) => ({
      id: key.id,
      name: key.name,
      prefix: key.prefix,
      last4: key.last4,
      isActive: key.isActive,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
      lastUsedAt: key.lastUsedAt,
      revokedAt: key.revokedAt,
    }));
  }

  async revoke(id: string, ownerUserId: string) {
    const existing = await this.accessKeyRepo.findOne({
      where: { id, ownerUserId },
    });

    if (!existing) {
      throw new NotFoundException('Access key not found');
    }

    existing.isActive = false;
    existing.revokedAt = new Date();
    await this.accessKeyRepo.save(existing);

    return { message: 'Access key revoked' };
  }

  async resolveOwnerByAccessKey(rawKey: string): Promise<string> {
    if (!rawKey || !rawKey.startsWith('ff_')) {
      throw new UnauthorizedException('Invalid access key');
    }

    const prefix = rawKey.split('_').slice(0, 2).join('_');
    const last4 = rawKey.slice(-4);

    const candidates = await this.accessKeyRepo.find({
      where: {
        prefix,
        last4,
        isActive: true,
      },
      take: 20,
    });

    for (const candidate of candidates) {
      const matched = await compare(rawKey, candidate.keyHash);
      if (!matched) continue;

      candidate.lastUsedAt = new Date();
      await this.accessKeyRepo.save(candidate);
      return candidate.ownerUserId;
    }

    throw new ForbiddenException('Access key is invalid or inactive');
  }

  private generateRawAccessKey(): string {
    const envPrefix = 'ff_live';
    const secret = randomBytes(32).toString('base64url');
    return `${envPrefix}_${secret}`;
  }
}
