/**
 * Utility functions to generate and store vector embeddings
 */

import { Document } from "@langchain/core/documents";
import { 
    MapReduceDocumentsChain, 
    RefineDocumentsChain, 
    StuffDocumentsChain 
} from "langchain/chains";

import { OpenAIEmbeddings } from "@langchain/openai";

/**
 * Interface defining parameters for the embedDocumentChunks()
 * function.
 * 
 */
export interface EmbedDocumentChunksParams {
    docChunk : Document<Record<string, any>>,
    summarizer?: StuffDocumentsChain |
                MapReduceDocumentsChain |
                RefineDocumentsChain,
}

/**
 * Function to take a list of docChunks, summarize each one, 
 * generate an embedding from the text, and create a 
 * transcript_chunk record in the database.
 */
export async function embedDocumentChunks({
    docChunk,
    // summarizer,
} : EmbedDocumentChunksParams){
    try {
        //summarize chunk before for better embedding
        // const summary = await summarizer.invoke({
        //     input_documents: [docChunk.pageContent],
        // });
    
        //Generate and set embedding
        const embedding = await generateOpenAIEmbedding(docChunk.pageContent);

        return embedding;
    }
    catch(err){
        console.log(err);
    }
}

/***    
 * Takes input string, strips middle dot ("Georgian Comma")
 * Trims each line before joining them all together
 */
export function formatTextForDatabase(_input: string) {
    return  _input.replaceAll('\u00B7', '')
            .split('\n')
            .map(element =>  element.trim())
            .join('\n');
}

/***
 * Takes input string, strips middle dot ("Georgian Comma")
 * Removes newlines and replaces with spaces.
 * Trims each line before joining them all together
 */
export function formatTextForEmbedding(_input: string) {
    return  _input.replaceAll('\u00B7', '')
            .split('\n')
            .map(element =>  element.trim())
            .join(' ');
}

export async function generateOpenAIEmbedding(_input: string) {
    const embedder = new OpenAIEmbeddings({
        model: 'text-embedding-3-large',
        dimensions: 1024,
        verbose : false,
      });
      
    const formattedInput = formatTextForEmbedding(_input);
    const embedding = await embedder.embedQuery(formattedInput);
    return embedding;
}