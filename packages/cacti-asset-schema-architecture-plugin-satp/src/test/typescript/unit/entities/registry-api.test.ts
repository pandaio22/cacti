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
    it("should return a success message and an unique id when calling commissionAsset() with an available service and valid schema", async () => {
      // Given: a JSON-LD schema for an asset
      const schema = {
        "@context": "https://schema.org",
        "@type": "Asset",
        name: "Alice's Car",
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
