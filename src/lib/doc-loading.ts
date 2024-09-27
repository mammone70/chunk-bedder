/**
 * Utility methods to load documents for chunking and embedding
 */

import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { Document } from "@langchain/core/documents";

export async function loadPDF(
    pdfURL : string
) : Promise<Document<Record<string, any>>[]> {
    const response = await fetch(pdfURL);
    const pdfBlob = await response.blob();
    const loader = new WebPDFLoader(pdfBlob);
    const docs = await loader.load();  
    
    return docs;
}