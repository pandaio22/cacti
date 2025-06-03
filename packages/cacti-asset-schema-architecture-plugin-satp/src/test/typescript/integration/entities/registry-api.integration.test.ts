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

  describe("Test /POST commissionAssetSchema() method", () => {
    it("should return a success message and an unique id when calling commissionAsset() with an available service and valid JSON-LD schema", async () => {
      // Given: a JSON-LD schema for an asset
      const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Alice",
      };
      // When: a POST request is made to /commission
      const response = await request(registryApi.app)
        .post("/commission-asset-schema")
        .send(schema)
        .set("Content-Type", "application/json");
      // Then: response should be 200 and contain the expected data
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Asset schema commissioned successfully",
      );
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
        .post("/commission-asset-schema")
        .send(schema)
        .set("Content-Type", "application/json");
      // Then: response should be 200 and contain the expected data
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Asset schema commissioned successfully",
      );
      expect(response.body.received).toEqual(schema);
      expect(response.body.schemaId).toBeDefined();
    });
    it("should throw an exception when given when calling commissionAsset() with an available service and an syntactically invalid schema", async () => {
      // Given: a JSON-LD schema for an asset
      const schema = {
        context: "https://schema.org",
        type: "Asset",
        name: "Alice's Car",
      };
      // When: a POST request is made to /commission
      const response = await request(registryApi.app)
        .post("/commission-asset-schema")
        .send(schema)
        .set("Content-Type", "application/json");
      // Then: response should be 400 and throw an exception
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid asset schema data");
    });
    it.skip("should throw an exception when calling commissionAsset() with an unavailable service and a valid schema", async () => {});
    //it("", async () => {});
  });

  describe("Test /POST commissionSchemaProfile() method", () => {
    it("should return a success message and an unique id when calling commissionAsset() with an available service and valid schema profile", async () => {
      // Given: a JSON-LD schema profile
      const schemaProfile = {
        "@context": {
          "@version": 1.1,
          asset_schema: "https://gateway.satp.ietf.org/asset_schema/",
          dcap: {
            "@id": "https://www.culture.example.org/asset_profile/dcap",
            "@context": {
              rwa: {
                "@id": "https://www.culture.example.org/asset_profile/rwa",
                "@context": {
                  digital_carrier_id: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/digital_carrier_id",
                    "@type": "schema:string",
                  },
                  digital_carrier_type: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/digital_carrier_type",
                    "@type": "schema:string",
                  },
                  rwa_kind: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/rwa_kind",
                    "@container": "@language",
                  },
                  rwa_description: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/rwa_description",
                    "@container": "@language",
                  },
                  rwa_current_storage: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/rwa_current_storage",
                    "@container": "@language",
                  },
                  rwa_storage_location: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/rwa_storage_location",
                    "@container": "@language",
                  },
                },
              },
              dar: {
                "@id": "https://www.culture.example.org/asset_profile/dar",
                "@context": {
                  dar_id: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/dar_id",
                    "@type": "schema:string",
                  },
                  dar_system_id: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/dar_system_id",
                    "@type": "schema:string",
                  },
                  dar_url: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/dar_url",
                    "@type": "schema:url",
                  },
                  dar_description: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/dar_description",
                    "@container": "@language",
                  },
                },
              },
            },
          },
        },
        "@id": "https://www.culture.example.org/asset_profile",
        "schema:title": "Asset Profile for Cultural Assets",
        "schema:organization": {
          "@id": "https://www.culture.example.org/",
          "schema:email": "info@culture.example.org",
          "asset_schema:organization_key": {
            "asset_schema:public_key":
              "did:v1:test:nym:JApJf12r82Pe6PBJ3gJAAwo8F7uDnae6B4ab9EFQ7XXk#authn-key-1",
            "asset_schema:issued": "2018-03-15T00:00:00Z",
          },
        },
        "asset_schema:facets": {
          owmner_transferability: "non-transferable",
          network_transferability: "evm_compatible_network",
          jurisdiction: {
            ownerJurisdictionScope: {
              law: "https://www.officialjoutrnal.example.org/eli/law/yyyy/nnnn/enacted/data.json",
              territory: "Some country",
            },
          },
        },
      };
      // When: a POST request is made to /commission
      const response = await request(registryApi.app)
        .post("/commission-schema-profile")
        .send(schemaProfile)
        .set("Content-Type", "application/json");
      // Then: response should be HTTP 200 and contain the corresponding schema id
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Schema Profile commissioned successfully",
      );
      expect(response.body.received).toEqual(schemaProfile);
      expect(response.body.schemaId).toBeDefined();
    });
    it("should throw an exception when calling commissionAsset() with a syntactically invalid schema profile", async () => {
      // Given: a syntactically invalid JSON-LD schema profile
      const schemaProfile = {
        "@context": {
          "@version": 1.1,
          assetschema: "https://gateway.satp.ietf.org/asset_schema/",
          dcap: {
            "@id": "https://www.culture.example.org/asset_profile/dcap",
            "@context": {
              rwa: {
                "@id": "https://www.culture.example.org/asset_profile/rwa",
                "@context": {
                  digital_carrier_id: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/digital_carrier_id",
                    "@type": "schema:string",
                  },
                  digital_carrier_type: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/digital_carrier_type",
                    "@type": "schema:string",
                  },
                  rwa_kind: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/rwa_kind",
                    "@container": "@language",
                  },
                  rwa_description: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/rwa_description",
                    "@container": "@language",
                  },
                  rwa_current_storage: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/rwa_current_storage",
                    "@container": "@language",
                  },
                  rwa_storage_location: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/rwa_storage_location",
                    "@container": "@language",
                  },
                },
              },
              dar: {
                "@id": "https://www.culture.example.org/asset_profile/dar",
                "@context": {
                  dar_id: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/dar_id",
                    "@type": "schema:string",
                  },
                  dar_system_id: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/dar_system_id",
                    "@type": "schema:string",
                  },
                  dar_url: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/dar_url",
                    "@type": "schema:url",
                  },
                  dar_description: {
                    "@id":
                      "https://www.culture.example.org/asset_profile/dar_description",
                    "@container": "@language",
                  },
                },
              },
            },
          },
        },
        "@id": "https://www.culture.example.org/asset_profile",
        "schema:title": "Asset Profile for Cultural Assets",
        "schema:organization": {
          "@id": "https://www.culture.example.org/",
          "schema:email": "info@culture.example.org",
          "asset_schema:organization_key": {
            "asset_schema:public_key":
              "did:v1:test:nym:JApJf12r82Pe6PBJ3gJAAwo8F7uDnae6B4ab9EFQ7XXk#authn-key-1",
            "asset_schema:issued": "2018-03-15T00:00:00Z",
          },
        },
        "asset_schema:facets": {
          owmner_transferability: "non-transferable",
          network_transferability: "evm_compatible_network",
          jurisdiction: {
            ownerJurisdictionScope: {
              law: "https://www.officialjoutrnal.example.org/eli/law/yyyy/nnnn/enacted/data.json",
              territory: "Some country",
            },
          },
        },
      };
      // When: a POST request is made to /commission
      const response = await request(registryApi.app)
        .post("/commission-schema-profile")
        .send(schemaProfile)
        .set("Content-Type", "application/json");
      // Then: response should be HTTP 400 and throw an exception
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid schema profile data");
    });
    it("should throw an exception when calling commissionAsset() with an semantically invalid schema profile", async () => {
      // Given: a semantically invalid JSON-LD schema profile
      // When: a POST request is made to /commission
      // Then: response should be HTTP 400 and throw an exception
    });
  });
  describe("Test /POST commissionTokenisedAssetrecord() method", () => {});
  describe("Test /POST commissionAssetSchemaAuthority() method", () => {});
  describe("Test /POST commissionAssetProviders() method", () => {});
  describe("Test /GET get() method", () => {});

  describe("Test /GET decommission() method", () => {});
});
