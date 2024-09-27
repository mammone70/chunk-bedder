import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";

import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as documentChunkSchema from "../drizzle/schemas/documents/document_chunks";

import { CHUNK_BEDDER_QUEUE } from "src/constants";
import { DATABASE_CONNECTION } from "src/database/database-connection";

import { ChunkBedderDTO } from "src/dto/chunk-bedder.dto";
import { recursivelySplitDocs } from "src/lib/chunking";
import { loadPDF } from "src/lib/doc-loading";
import { embedDocumentChunks, formatTextForDatabase } from "src/lib/embedding";
import { document_chunks } from "../drizzle/schemas/documents/document_chunks";

@Processor(CHUNK_BEDDER_QUEUE)
export class ChunkBedderProcessor extends WorkerHost {
    private readonly logger = new Logger(ChunkBedderProcessor.name);
    
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof documentChunkSchema>

    async process(job: Job<ChunkBedderDTO, any, string>): Promise<any> {
        switch (job.name){
            case CHUNK_BEDDER_QUEUE:
                this.logger.log(`Processing job id ${job.id}`);
                this.logger.debug(`Data : ${JSON.stringify(job)}`);

                //TODO Dependency Inject this functionality
                //load docs, split/chunk, embed
                const { documentId, url} = job.data;
        
                const docs = await loadPDF(url);
                const chunkedDocs = await recursivelySplitDocs(
                    docs,
                    1000,
                    200
                );

                for (const docChunk of chunkedDocs) {
                    //set chunk metadata
                    const newChunkObject  = {
                        pageNumber : docChunk.metadata.loc.pageNumber,
                        fromLine : docChunk.metadata.loc.lines.from,
                        toLine : docChunk.metadata.loc.lines.to,
                        content : formatTextForDatabase(docChunk.pageContent), 
                        documentId : documentId,
                        embedding : null,
                    }
                
              
                    const embedding = await embedDocumentChunks({
                        docChunk,
                    });
                    newChunkObject.embedding = embedding;

                    //insert transcript chunk with embedding
                    await this.database
                      .insert(document_chunks)
                      .values(newChunkObject);
                }
                this.logger.log(`Processing complete for job id ${job.id}`);
                break;
        }
    }
}