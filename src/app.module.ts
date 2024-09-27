import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChunkBedderModule } from './chunk-bedder/chunk-bedder.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
    }),
    BullModule.forRootAsync({
      imports : [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection : {
          host : configService.get('REDIS_HOST'),
          port : configService.get('REDIS_PORT'),
        }
      }),
      inject : [ConfigService],
    }),
    ChunkBedderModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
