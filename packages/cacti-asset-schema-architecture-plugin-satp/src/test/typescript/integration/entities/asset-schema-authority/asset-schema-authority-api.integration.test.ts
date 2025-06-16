import { AssetSchemaAuthorityApi } from "../../../../../main/typescript/entities/asset-schema-authority/asset-schema-authority-api";
import { AssetSchemaAuthorityService } from "../../../../../main/typescript/entities/asset-schema-authority/modules/services/asset-schema-authority-service";
import request from "supertest";

describe("AssetSchemaAuthorityApi", () => {
  let assetSchemaAuthorityService: AssetSchemaAuthorityService;
  let assetSchemaAuthorityApi: AssetSchemaAuthorityApi;

  beforeEach(async () => {
    assetSchemaAuthorityService = new AssetSchemaAuthorityService();
    assetSchemaAuthorityApi = new AssetSchemaAuthorityApi(
      assetSchemaAuthorityService,
    );

    await assetSchemaAuthorityApi.start();
  });
  afterEach(async () => {
    await assetSchemaAuthorityApi.stop();
  });

  describe("Test POST /certificate-asset-schema", () => {
    it("should sign an asset schema when given a valid JSON-LD asset schema", async () => {
      // Given: a valid JSON-LD asset schema
      const assetSchema = {
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
            "@id":
              "https://web.tecnico.ulisboa.pt/~ist173130/ontology/ontology-satp-facets.jsonld#",
            "@type": "https://schema.org/Boolean",
          },
          organization_key: {
            "@id":
              "https://web.tecnico.ulisboa.pt/~ist173130/ontology/ontology-satp-facets.jsonld#",
            "@context": {
              public_key: {
                "@id":
                  "https://web.tecnico.ulisboa.pt/~ist173130/ontology/ontology-satp-facets.jsonld#",
                "@type": "schema:string",
              },
              issued: {
                "@id":
                  "https://web.tecnico.ulisboa.pt/~ist173130/ontology/ontology-satp-facets.jsonld#",
                "@type": "schema:string",
              },
            },
          },
          facets: {
            "@id":
              "https://web.tecnico.ulisboa.pt/~ist173130/ontology/ontology-satp-facets.jsonld#",
          },
        },
        "@id":
          "https://web.tecnico.ulisboa.pt/~ist173130/ontology/ontology-satp-facets.jsonld#",
        "foaf:name": "Example Corp",
        organization_key: {
          public_key: "0xabcdef1234567890",
          issued: "2025-05-31T10:00:00Z",
        },
        facets: {
          "skos:note": "A sample asset representing an organization with a key",
          "schema:category": "financial",
        },
        fungible: true,
        schema_version: 1.0,
      };
      // When: a POST request is made to /certificate-asset-schema
      const response = await request(assetSchemaAuthorityApi.app)
        .post("/certificate-asset-schema")
        .send(assetSchema)
        .set("Content-Type", "application/json");
      // Then: the response should be successful (200) and contain a signed asset schema according to W3C JSON-LD signatures
      expect(response.status).toBe(200);
      expect(response.body.received).toHaveProperty("proof");
      expect(response.body.received.proof).toHaveProperty("type");
      expect(response.body.received.proof).toHaveProperty("created");
      expect(response.body.received.proof).toHaveProperty("proofPurpose");
      expect(response.body.received.proof).toHaveProperty("verificationMethod");
      expect(response.body.received.proof).toHaveProperty("jws");
    });
  });
});
