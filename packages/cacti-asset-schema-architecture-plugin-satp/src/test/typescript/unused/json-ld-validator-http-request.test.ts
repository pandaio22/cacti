import { JsonLdValidator } from "../../../main/typescript/validation/json-ld-validator";

describe("JsonLdValidator Integration Tests", () => {
  // Remove the jest.mock() - we want real HTTP requests

  it("should validate JSON-LD that requires fetching remote context", async () => {
    const jsonLdWithRemoteContext = {
      "@context": "https://www.w3.org/ns/activitystreams",
      "@type": "Person",
      name: "John Doe",
    };

    // This will make a real HTTP request to fetch the ActivityStreams context
    const result = await JsonLdValidator.validate(jsonLdWithRemoteContext);
    expect(result).toBe(true);
  }, 10000); // Longer timeout for network requests

  it("should handle network failures gracefully", async () => {
    const jsonLdWithBadContext = {
      "@context": "https://nonexistent-domain-12345.com/context.json",
      type: "Person",
    };

    await expect(
      JsonLdValidator.validate(jsonLdWithBadContext),
    ).rejects.toThrow(/Invalid JSON-LD/);
  });
});
