import { IsUrl, IsUUID } from "class-validator";

export class ChunkBedderDTO {

    /**
     * Document ID
     */
    @IsUUID()
    documentId : string;

    /**
     * URL of stored file
     */
    @IsUrl()
    url : URL;

}