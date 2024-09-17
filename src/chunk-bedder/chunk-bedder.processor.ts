import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { CHUNK_BEDDER_QUEUE } from "src/constants";
import { ChunkBedderDTO } from "src/dto/chunk-bedder.dto";

@Processor(CHUNK_BEDDER_QUEUE)
export class ChunkBedderProcessor extends WorkerHost {
    private readonly logger = new Logger(ChunkBedderProcessor.name);

    async process(job: Job<ChunkBedderDTO, any, string>): Promise<any> {
        switch (job.name){
            case CHUNK_BEDDER_QUEUE:
                this.logger.log(`Processing job id ${job.id}`);
                this.logger.debug(`Data : ${JSON.stringify(job.data)}`);

                //artificial delay to simulate long running process
                await new Promise<void>((resolve) => setTimeout(() => resolve(), 8000));
                this.logger.log(`Processing complete for job id ${job.id}`);
                break;
        }
    }
}