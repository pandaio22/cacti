import request from "supertest";
import app from "../../../main/typescript/endpoints/endpoints";
import { JsonLdValidator } from "../../../main/typescript/validation/json-ld-validator";

// Mock the JsonLdValidator for controlled testing
jest.mock("../../../main/typescript/validation/json-ld-validator");
const mockJsonLdValidator = JsonLdValidator as jest.Mocked<
  typeof JsonLdValidator
>;

describe("Express App Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /commission", () => {
    it("should successfully commission valid JSON-LD and return an ID", async () => {
      // Arrange
      const validJsonLd = {
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Person",
        name: "John Doe",
        email: "john@example.com",
      };

      mockJsonLdValidator.validate.mockResolvedValue(true);

      // Act
      const response = await request(app)
        .post("/commission")
        .send(validJsonLd)
        .expect(201);

      // Assert
      expect(response.body).toHaveProperty("id");
      expect(response.body.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      ); // UUID format
      expect(mockJsonLdValidator.validate).toHaveBeenCalledWith(validJsonLd);
    });

    it("should reject invalid JSON-LD and return 400 error", async () => {
      // Arrange
      const invalidJsonLd = {
        invalid: "data without context",
      };

      mockJsonLdValidator.validate.mockRejectedValue(
        new Error("Invalid JSON-LD: Missing @context"),
      );

      // Act
      const response = await request(app)
        .post("/commission")
        .send(invalidJsonLd)
        .expect(400);

      // Assert
      expect(response.body).toEqual({
        error: "Invalid JSON-LD format",
        details: "Invalid JSON-LD: Missing @context",
      });
      expect(mockJsonLdValidator.validate).toHaveBeenCalledWith(invalidJsonLd);
    });

    it("should handle JSON-LD validation timeout errors", async () => {
      // Arrange
      const jsonLdWithSlowContext = {
        "@context": "https://slow-server.com/context.json",
        type: "Person",
      };

      mockJsonLdValidator.validate.mockRejectedValue(
        new Error("Invalid JSON-LD: Request timeout"),
      );

      // Act
      const response = await request(app)
        .post("/commission")
        .send(jsonLdWithSlowContext)
        .expect(400);

      // Assert
      expect(response.body.error).toBe("Invalid JSON-LD format");
      expect(response.body.details).toBe("Invalid JSON-LD: Request timeout");
    });

    it("should handle malformed JSON in request body", async () => {
      // Act
      const response = await request(app)
        .post("/commission")
        .send('{"invalid": json}') // Malformed JSON
        .set("Content-Type", "application/json")
        .expect(400);

      // Assert - Express will handle JSON parsing errors before our validator runs
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /resource/:id", () => {
    it("should retrieve a commissioned resource by ID", async () => {
      // Arrange - First commission a resource
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Test Company",
      };

      mockJsonLdValidator.validate.mockResolvedValue(true);

      const commissionResponse = await request(app)
        .post("/commission")
        .send(jsonLd)
        .expect(201);

      const { id } = commissionResponse.body;

      // Act - Retrieve the resource
      const response = await request(app).get(`/resource/${id}`).expect(200);

      // Assert
      expect(response.body).toEqual(jsonLd);
    });

    it("should return 404 for non-existent resource ID", async () => {
      // Act
      const response = await request(app)
        .get("/resource/non-existent-id")
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        error: "Resource not found",
      });
    });

    it("should return 404 for malformed UUID", async () => {
      // Act
      const response = await request(app)
        .get("/resource/invalid-uuid-format")
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        error: "Resource not found",
      });
    });
  });

  describe("POST /decommission", () => {
    it("should successfully decommission an existing resource", async () => {
      // Arrange - First commission a resource
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Event",
        name: "Test Event",
      };

      mockJsonLdValidator.validate.mockResolvedValue(true);

      const commissionResponse = await request(app)
        .post("/commission")
        .send(jsonLd)
        .expect(201);

      const { id } = commissionResponse.body;

      // Act - Decommission the resource
      const response = await request(app)
        .post("/decommission")
        .send({ id })
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        message: `Resource with ID ${id} decommissioned.`,
      });

      // Verify resource is actually removed
      await request(app).get(`/resource/${id}`).expect(404);
    });

    it("should return 404 when trying to decommission non-existent resource", async () => {
      // Act
      const response = await request(app)
        .post("/decommission")
        .send({ id: "non-existent-id" })
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        error: "Resource not found or invalid ID",
      });
    });

    it("should return 404 when no ID is provided", async () => {
      // Act
      const response = await request(app)
        .post("/decommission")
        .send({}) // No ID provided
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        error: "Resource not found or invalid ID",
      });
    });
  });

  describe("Full workflow integration", () => {
    it("should handle complete commission -> retrieve -> decommission workflow", async () => {
      // Arrange
      const jsonLd = {
        "@context": {
          "@vocab": "https://schema.org/",
          Person: "https://schema.org/Person",
        },
        "@type": "Person",
        name: "Integration Test User",
        email: "test@integration.com",
        jobTitle: "Software Developer",
      };

      mockJsonLdValidator.validate.mockResolvedValue(true);

      // Step 1: Commission
      const commissionResponse = await request(app)
        .post("/commission")
        .send(jsonLd)
        .expect(201);

      const { id } = commissionResponse.body;
      expect(id).toBeTruthy();

      // Step 2: Retrieve
      const retrieveResponse = await request(app)
        .get(`/resource/${id}`)
        .expect(200);

      expect(retrieveResponse.body).toEqual(jsonLd);

      // Step 3: Decommission
      await request(app).post("/decommission").send({ id }).expect(200);

      // Step 4: Verify removal
      await request(app).get(`/resource/${id}`).expect(404);
    });

    it("should handle multiple resources independently", async () => {
      // Arrange
      const jsonLd1 = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Alice",
      };

      const jsonLd2 = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ACME Corp",
      };

      mockJsonLdValidator.validate.mockResolvedValue(true);

      // Commission both resources
      const [response1, response2] = await Promise.all([
        request(app).post("/commission").send(jsonLd1).expect(201),
        request(app).post("/commission").send(jsonLd2).expect(201),
      ]);

      const id1 = response1.body.id;
      const id2 = response2.body.id;

      // Verify both exist and are different
      expect(id1).not.toBe(id2);

      const [retrieve1, retrieve2] = await Promise.all([
        request(app).get(`/resource/${id1}`).expect(200),
        request(app).get(`/resource/${id2}`).expect(200),
      ]);

      expect(retrieve1.body).toEqual(jsonLd1);
      expect(retrieve2.body).toEqual(jsonLd2);

      // Decommission one, verify the other still exists
      await request(app).post("/decommission").send({ id: id1 }).expect(200);

      await request(app).get(`/resource/${id1}`).expect(404);

      await request(app).get(`/resource/${id2}`).expect(200);
    });
  });
});
