// asset-schema-structure.test.ts
import { assetSchema } from "../../../main/typescript/data-model/asset-schema";

describe("assetSchema", () => {
  it('should have a valid "@id" property', () => {
    expect(assetSchema["@id"]).toBe(
      "https://example.com/schemas/asset-schema-001",
    );
  });

  it('should have a "@context" property with the correct structure', () => {
    expect(assetSchema["@context"]).toHaveProperty("version");
    expect(assetSchema["@context"]).toHaveProperty("fungibility");
    expect(assetSchema["@context"]).toHaveProperty("facets");
    expect(assetSchema["@context"]).toHaveProperty("organization_key");

    // Check the version structure
    expect(assetSchema["@context"].version).toHaveProperty("@id");
    expect(assetSchema["@context"].version).toHaveProperty("@type");

    // Check the fungibility structure
    expect(assetSchema["@context"].fungibility).toHaveProperty("@id");
    expect(assetSchema["@context"].fungibility).toHaveProperty("@type");

    // Check the facets structure
    expect(assetSchema["@context"].facets).toHaveProperty("@id");

    // Check the organization_key structure
    expect(assetSchema["@context"].organization_key).toHaveProperty("@id");
    expect(assetSchema["@context"].organization_key).toHaveProperty("@context");

    // Check the organization_key context
    expect(assetSchema["@context"].organization_key["@context"]).toHaveProperty(
      "public_key",
    );
    expect(assetSchema["@context"].organization_key["@context"]).toHaveProperty(
      "issued",
    );
  });

  it('should validate the "organization_key" public_key structure', () => {
    const publicKey =
      assetSchema["@context"].organization_key["@context"].public_key;
    expect(publicKey["@id"]).toBe(
      "https://example.com/organizations/org123/public-key",
    );
    expect(publicKey["@type"]).toBe("PublicKey");
  });

  it('should validate the "organization_key" issued structure', () => {
    const issued = assetSchema["@context"].organization_key["@context"].issued;
    expect(issued["@id"]).toBe(
      "https://example.com/organizations/org123/issued",
    );
    expect(issued["@type"]).toBe("IssuedDate");
  });

  it('should ensure fungibility is "fungible"', () => {
    const fungibility = assetSchema["@context"].fungibility;
    expect(fungibility["@id"]).toBe(
      "https://example.com/schemas/fungibility/fungible",
    );
    expect(fungibility["@type"]).toBe("FungibilityType");
  });

  it("should ensure version is v1", () => {
    const version = assetSchema["@context"].version;
    expect(version["@id"]).toBe("https://example.com/schemas/v1");
    expect(version["@type"]).toBe("SchemaVersion");
  });
});
