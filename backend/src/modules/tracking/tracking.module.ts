import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingEvent } from './entities/tracking-event.entity';
import { TrackingService } from './tracking.service';

@Module({
  imports: [TypeOrmModule.forFeature([TrackingEvent])],
  providers: [TrackingService],
  exports: [TrackingService, TypeOrmModule],
})
export class TrackingModule {}
