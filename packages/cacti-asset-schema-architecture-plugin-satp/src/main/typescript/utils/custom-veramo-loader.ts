import { LdDefaultContexts } from "@veramo/credential-ld";
import jsonld from "jsonld";

/**
 * Creates a document loader for CredentialIssuerLD that:
 * 1. Uses all context maps (Veramo default + custom)
 * 2. Falls back to network fetch only if context is unknown
 */
export function createVeramoDocumentLoader(customContexts?: Map<string, any>) {
  // Merge default + custom contexts
  const contextMaps: Map<string, any>[] = [LdDefaultContexts];
  if (customContexts) contextMaps.push(customContexts);

  return async (url: string) => {
    // Check local context maps first
    for (const map of contextMaps) {
      if (map.has(url)) {
        return {
          contextUrl: null,
          documentUrl: url,
          document: map.get(url),
        };
      }
    }

    // Fallback to standard JSON-LD loader
    // Uses node-fetch under the hood, so avoid network issues
    return (jsonld as any).documentLoaders.node()(url);
  };
}
