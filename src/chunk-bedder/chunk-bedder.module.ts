import { Module } from '@nestjs/common';
import { ChunkBedderController } from './chunk-bedder.controller';
import { BullModule } from '@nestjs/bullmq';
import { ChunkBedderProcessor } from './chunk-bedder.processor';
import { CHUNK_BEDDER_QUEUE } from 'src/constants';

@Module({
  imports : [
    BullModule.registerQueue({
      name: CHUNK_BEDDER_QUEUE,
    }),
  ],
  controllers: [ChunkBedderController],
  providers: [ChunkBedderProcessor],
})
export class ChunkBedderModule {}
