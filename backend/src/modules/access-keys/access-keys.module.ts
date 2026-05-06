import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessKey } from './entities/access-key.entity';
import { AccessKeysController } from './access-keys.controller';
import { AccessKeysService } from './access-keys.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccessKey])],
  controllers: [AccessKeysController],
  providers: [AccessKeysService],
  exports: [AccessKeysService, TypeOrmModule],
})
export class AccessKeysModule {}
