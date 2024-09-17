import { InjectQueue } from '@nestjs/bullmq';
import { Body, Controller, Post } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CHUNK_BEDDER_QUEUE } from 'src/constants';
import { ChunkBedderDTO } from 'src/dto/chunk-bedder.dto';


@Controller('chunk-bedder')
export class ChunkBedderController {
    constructor(@InjectQueue(CHUNK_BEDDER_QUEUE) private readonly chunkBedderQueue: Queue) {}

    @Post()
    async chunkBed(@Body() chunkBedderDTO : ChunkBedderDTO) {
        await this.chunkBedderQueue.add(
            CHUNK_BEDDER_QUEUE,
            chunkBedderDTO,
        );
    }
}
