import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationModule } from './modules/evaluation/evaluation.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'environment/development.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get<string>('DATABASE_URL');

        console.log("DB URL FROM CONFIG:", dbUrl); // keep this for debug

        return {
          type: 'postgres',
          url: dbUrl,
          autoLoadEntities: true,
          synchronize: false,

          ssl: {
            rejectUnauthorized: false,
          },

          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        };
      },
    }),


    EvaluationModule
  ],
})
export class AppModule { }