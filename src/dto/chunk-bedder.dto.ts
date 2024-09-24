import { IsString } from "class-validator";

export class ChunkBedderDTO {

    /**
     * Document ID
     */
    // @IsUUID("4")
    @IsString()
    documentId : string;

    /**
     * URL of stored file
     */
    // @IsUrl()
    @IsString()
    url : string;

}