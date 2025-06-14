import { AssetSchemaAuthorityApi } from "../../../../../main/typescript/entities/asset-definition-authority/asset-schema-authority-api";
import { AssetSchemaAuthorityService } from "../../../../../main/typescript/entities/asset-definition-authority/modules/services/asset-schema-authority-service";
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
          name: "http://schema.org/name",
          age: "http://schema.org/age",
        },
        name: "John Doe",
        age: 30,
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
