
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function recursivelySplitDocs(
    docs : Document<Record<string, any>>[],
    chunkSize : number,
    chunkOverlap : number

) : Promise<Document<Record<string, any>>[]> {
    //splitter
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: chunkSize,
        chunkOverlap: chunkOverlap,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    return splitDocs;
}