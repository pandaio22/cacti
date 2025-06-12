import { RegistryApi } from "../../../../main/typescript/entities/registry/registry-api";
import { RegistryApiService } from "../../../../main/typescript/entities/registry/modules/registry-api-service";
import request from "supertest";
import { string } from "yargs";

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
    it.skip("should return a success message and an unique id when calling commissionAsset() with an available service and valid JSON-LD schema", async () => {
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
          schema_version: {
            "@id": "https://schema.org/schemaVersion",
            "@type": "@id",
          },
          foaf: "http://xmlns.com/foaf/0.1/",
          schema: "http://schema.org/",
          skos: "http://www.w3.org/2004/02/skos/core#",
          xsd: "http://www.w3.org/2001/XMLSchema#",
          rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
          fungible: {
            "@id": "https://example.org/fungibility",
            "@type": "https://schema.org/Boolean",
          },
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
        description: "An example asset schema for an organization",
        fungible: true,
        schema_version: 1.0,
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
      expect(response.body.error).toEqual("Invalid asset schema data");
      expect(typeof response.body.details).toBe("string");
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
          asset_schema:
            "did:ipfs:QmYdfWp9FKS1EshoKeyjZHwRXgn6ognPFV9EbN25qhAWfP",
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
            public_key:
              "did:v1:test:nym:JApJf12r82Pe6PBJ3gJAAwo8F7uDnae6B4ab9EFQ7XXk#authn-key-1",
            issued: "2018-03-15T00:00:00Z",
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
            public_key:
              "did:v1:test:nym:JApJf12r82Pe6PBJ3gJAAwo8F7uDnae6B4ab9EFQ7XXk#authn-key-1",
            issued: "2018-03-15T00:00:00Z",
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
      // Then: response should be 400 and throw an exception
      expect(response.status).toBe(400);
      expect(response.body.error).toEqual("Invalid schema profile data");
      expect(typeof response.body.details).toBe("string");
    });
    it.skip("should throw an exception when calling commissionAsset() with an semantically invalid schema profile", async () => {
      // Given: a semantically invalid JSON-LD schema profile
      // When: a POST request is made to /commission
      // Then: response should be HTTP 400 and throw an exception
    });
  });
  describe("Test /POST commissionTokenizedAssetRecord() method", () => {
    it("should return a success message and an unique id when calling commissionTokenizedAssetRecord() with an available service and valid TAR", async () => {
      // Given: a JSON-LD schema for a tokenized asset record
      const tar = {
        "@context": "did:ipfs:QmThwy7F7k1aTGPjUeuiqgkhH2gmyzx36VGkcJPzgehEgJ",
        "@id": "https://www.culture.example.org/tokenized_asset_record/12345",
        dcap: {
          rwa: {
            digital_carrier_id: "E492069BT491278256346325",
            digital_carrier_type: "rfid_tag",
            rwa_kind: {
              en: "Various cases",
            },
            rwa_description: {
              en: "Blue velvet jewelry box with fabric lining on the inside. The metal edges in gold colour can be seen at the application point of the hinged cover.",
            },
            rwa_current_storage: {
              en: "Former Royal Estate",
            },
            rwa_storage_location: {
              en: "Former Royal Estate, Box XX",
            },
          },
          dcar: {
            dar_id: "911024",
            dar_system_id: "5TDYIU",
            dar_url: "https://www.culture.example.org/doi/5TDYIU/911024",
            dar_description: {
              en: " Blue velvet jewelry box with fabric lining inside.",
            },
          },
        },
      };
      // When: a POST request is made to /commission-tokenized-asset-record
      const response = await request(registryApi.app)
        .post("/commission-tokenized-asset-record")
        .send(tar)
        .set("Content-Type", "application/json");
      // Then: response should be HTTP 200 and contain the expected data
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Tokenized Asset Record commissioned successfully",
      );
      expect(response.body.received).toEqual(tar);
      expect(response.body.tokenizedAssetRecordId).toBeDefined();
    });
    it.skip("should throw an exception when calling commissionTokenizedAssetRecord() with an unavailable service and valid TAR", async () => {
      // Given: a JSON-LD schema for a tokenized asset record
      // When: a POST request is made to /commission-tokenized-asset-record
      // Then: response should be HTTP 500 and throw an exception
    });
    it.skip("should throw an exception when calling commissionTokenizedAssetRecord() with a syntactically invalid TAR", async () => {
      // Given: a syntactically invalid JSON-LD schema for a tokenized asset record
      // When: a POST request is made to /commission-tokenized-asset-record
      // Then: response should be HTTP 400 and throw an exception
    });
  });
  describe("Test /POST commissionAssetSchemaAuthority() method", () => {});
  describe("Test /POST commissionAssetProviders() method", () => {});
  describe("Test /GET get() method", () => {
    it("should return an asset schema when calling get() with a valid unique id", async () => {
      // Given: a valid unique id
      const uniqueId: string = "QmYdfWp9FKS1EshoKeyjZHwRXgn6ognPFV9EbN25qhAWfP";
      // When: an HTTP request is made to /get
      const response = await request(registryApi.app)
        .get(`/get-asset-schema/${uniqueId}`)
        .set("Accept", "application/json");
      // Then: response should be HTTP 200 and return the asset schema
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Asset schema retrieved successfully");
      //assert that the response body contains the expected asset schema
    });
    it("should return a schema profile when calling get() with a valid unique id", async () => {
      // Given: a valid unique id
      // When: an HTTP request is made to /get
      // Then: response should be HTTP 200 and return the schema profile
    });
    it("should return a Tokenized Asset Record (TAR) when calling get() with a valid unique id", async () => {
      // Given: a valid unique id
      // When: an HTTP request is made to /get
      // Then: response should be HTTP 200 and return the tokenized asset record
    });
    it("should return an Asset Schema Authority public key when calling get() with a valid unique id", async () => {
      // Given: a valid unique id
      // When: an HTTP request is made to /get
      // Then: response should be HTTP 200 and return the Asset Schema Authority public key
    });
    it("should return an Asset Provider public key when calling get() with a valid unique id", async () => {
      // Given: a valid unique id
      // When: an HTTP request is made to /get
      // Then: response should be HTTP 200 and return the Asset Provider public key
    });
    it("should throw an exception when calling get() with an invalid unique id", async () => {
      // Given: an invalid unique id
      // When: an HTTP request is made to /get
      // Then: response should be HTTP 400 and throw an exception
    });
    it("should throw an exception when calling get() with a null unique id", async () => {
      // Given: a null input
      const uniqueId = null;
      // When: an HTTP request is made to /get
      const response = await request(registryApi.app)
        .get(`/get-asset-schema/${uniqueId}`)
        .set("Accept", "application/json");
      // Then: response should be HTTP 500 and throw an exception
      expect(response.status).toBe(500);
      expect(response.body.error).toBe(
        "Invalid unique identifier for asset schema",
      );
    });
    it("should throw an exception when calling get() with a valid id but the asset schema is not returned", async () => {
      // Given: a valid input
      const uniqueId: string = "AmYdfWp9FKS1EshoKeyjZHwRXgn6ognPFV9EbN25qhAWfP";
      // When: an HTTP request is made to /get
      const response = await request(registryApi.app)
        .get(`/get-asset-schema/${uniqueId}`)
        .set("Accept", "application/json");
      // Then: response should be HTTP 500 and throw an exception
      expect(response.status).toBe(500);
      expect(response.body.error).toBe(
        "Invalid unique identifier for asset schema",
      );
    });
  });
  describe("Test /POST decommission() method", () => {});
});
