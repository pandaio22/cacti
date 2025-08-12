import jsonld from "jsonld";

export function createCustomLoader(localContexts: Record<string, any>) {
  return async function customLoader(url: string) {
    if (localContexts[url]) {
      return {
        contextUrl: null,
        documentUrl: url,
        document: localContexts[url],
      };
    }
    // fallback to default loader for other URLs
    return (jsonld as any).documentLoader.documentLoader(url);
  };
}
