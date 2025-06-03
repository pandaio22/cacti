import { RegistryApi } from "../../../../main/typescript/entities/registry/registry-api";
import { RegistryApiService } from "../../../../main/typescript/entities/registry/modules/registry-api-service";
import request from "supertest";

//jest.mock(
//  "../../../../main/typescript/entities/registry/modules/registry-api-service",
//);

describe("RegistryApiTest", () => {
  //let registryApiService: jest.Mocked<RegistryApiService>;
  let registryApiService: RegistryApiService;
  let registryApi: RegistryApi;

  beforeEach(async () => {
    registryApiService = new RegistryApiService();
    //registryApiService =
    //  new RegistryApiService() as jest.Mocked<RegistryApiService>;
    registryApi = new RegistryApi(registryApiService);
    await registryApi.start();
  });

  afterEach(async () => {
    await registryApi.stop();
    jest.clearAllMocks();
  });

  describe("Test /POST commissionAsset() method", () => {
    it("should return a success message and an unique id when calling commissionAsset() with an available service and valid JSON-LD schema", async () => {
      // Given: a JSON-LD schema for an asset
      const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Alice",
      };
      // When: a POST request is made to /commission
      const response = await request(registryApi.app)
        .post("/commission")
        .send(schema)
        .set("Content-Type", "application/json");
      // Then: response should be 200 and contain the expected data
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Asset commissioned successfully");
      expect(response.body.received).toEqual(schema);
      expect(response.body.schemaId).toBeDefined();
    });
    it("should return a success message and an unique id when calling commissionAsset() with an available service and valid asset schema", async () => {
      // Given: a JSON-LD schema for an asset
      const schema = {
        "@context": {
          "@version": 1.1,
          foaf: "http://xmlns.com/foaf/0.1/",
          schema: "http://schema.org/",
          skos: "http://www.w3.org/2004/02/skos/core#",
          xsd: "http://www.w3.org/2001/XMLSchema#",
          rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
          organization_key: {
            "@id": "https://satp.example.org/asset_schema_org_key",
            "@context": {
              public_key: {
                "@id": "https://gateway.satp.ietf.org/asset_schema_pub_key",
                "@type": "schema:string",
              },
              issued: {
                "@id": "https://gateway.satp.ietf.org/asset_schema_key_issued",
                "@type": "schema:string",
              },
            },
          },
          facets: {
            "@id": "https://satp.example.org/asset_schema_facets",
          },
        },
        "@id": "https://satp.example.org/asset_schema/organization/12345",
        "foaf:name": "Example Corp",
        organization_key: {
          public_key: "0xabcdef1234567890",
          issued: "2025-05-31T10:00:00Z",
        },
        facets: {
          "skos:note": "A sample asset representing an organization with a key",
          "schema:category": "financial",
        },
      };
      // When: a POST request is made to /commission
      const response = await request(registryApi.app)
        .post("/commission")
        .send(schema)
        .set("Content-Type", "application/json");
      // Then: response should be 200 and contain the expected data
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Asset commissioned successfully");
      expect(response.body.received).toEqual(schema);
      expect(response.body.schemaId).toBeDefined();
    });
    it.skip("should throw an exception when given when calling commissionAsset() with an unavailable service and a valid schema", async () => {});
    it("should throw an exception when given when calling commissionAsset() with an available service and an invalid schema", async () => {
      // Given: a JSON-LD schema for an asset
      const schema = {
        context: "https://schema.org",
        type: "Asset",
        name: "Alice's Car",
      };
      // When: a POST request is made to /commission
      const response = await request(registryApi.app)
        .post("/commission")
        .send(schema)
        .set("Content-Type", "application/json");
      // Then: response should be 400 and throw an exception
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid asset data");
    });
  });

  describe("Test /GET get() method", () => {});

  describe("Test /GET decommission() method", () => {});
});
