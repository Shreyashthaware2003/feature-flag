import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
import { FeatureModule } from './modules/feature/feature.module';
import { AuthModule } from './modules/auth/auth.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { FeatureFlag } from './modules/evaluation/entity/feature-flag.entity';
import { Rule } from './modules/evaluation/entity/rule.entity';
import { Variant } from './modules/evaluation/entity/variant.entity';
import { User } from './modules/auth/entities/user.entity';
import { TrackingEvent } from './modules/tracking/entities/tracking-event.entity';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { AccessKey } from './modules/access-keys/entities/access-key.entity';
import { AccessKeysModule } from './modules/access-keys/access-keys.module';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'environment/development.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          url: dbUrl,
          autoLoadEntities: true,
          entities: [FeatureFlag, Rule, Variant, User, TrackingEvent, AccessKey],
          synchronize: true,
          ssl: { rejectUnauthorized: false },
          extra: { ssl: { rejectUnauthorized: false } },
        };
      },
    }),
    AuthModule,
    TrackingModule,
    FeatureModule,
    EvaluationModule,
    AnalyticsModule,
    AccessKeysModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
