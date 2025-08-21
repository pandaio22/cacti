// types/jsonld-signatures/index.d.ts

declare module 'jsonld-signatures' {
  // Type for a generic JSON-LD document loader function
  export type DocumentLoader = (url: string) => Promise<{
    contextUrl: string | null;
    documentUrl: string;
    document: any;
    tag?: string;
  }>;

  // Function to extend a document loader
  export function extendContextLoader(
    loader: DocumentLoader
  ): DocumentLoader;

  // Optional: strict loader
  export const strictDocumentLoader: DocumentLoader;
}
