import request from "supertest";
import app from "../../../main/typescript/endpoints/endpoints";

describe("Express App Integration Tests (Real JSON-LD Validation)", () => {
  // Longer timeout for real network requests
  const TIMEOUT = 15000;

  describe("POST /commission", () => {
    it(
      "should successfully commission valid JSON-LD with well-known context and receive an HTTP code 201, when endpoint is called",
      async () => {
        // Arrange - Using ActivityStreams context (widely available and stable)
        const validJsonLd = {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Person",
          name: "John Doe",
          summary: "A test person for integration testing",
        };

        // Act
        const response = await request(app)
          .post("/commission")
          .send(validJsonLd)
          .timeout(TIMEOUT)
          .expect(201);

        // Assert
        expect(response.body).toHaveProperty("id");
        expect(response.body.id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
        ); // UUID format
      },
      TIMEOUT,
    );

    it(
      "should successfully commission JSON-LD with Schema.org context",
      async () => {
        // Arrange - Schema.org is another well-known, stable context
        const validJsonLd = {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Test Company",
          description: "A company for testing purposes",
          url: "https://example.com",
        };

        // Act
        const response = await request(app)
          .post("/commission")
          .send(validJsonLd)
          .timeout(TIMEOUT)
          .expect(201);

        // Assert
        expect(response.body).toHaveProperty("id");
        expect(typeof response.body.id).toBe("string");
      },
      TIMEOUT,
    );

    it(
      "should successfully commission JSON-LD with inline context",
      async () => {
        // Arrange - Inline context doesn't require HTTP requests
        const validJsonLd = {
          "@context": {
            name: "https://schema.org/name",
            Person: "https://schema.org/Person",
            Organization: "https://schema.org/Organization",
          },
          "@type": "Person",
          name: "Alice Smith",
        };

        // Act
        const response = await request(app)
          .post("/commission")
          .send(validJsonLd)
          .timeout(TIMEOUT)
          .expect(201);

        // Assert
        expect(response.body).toHaveProperty("id");
      },
      TIMEOUT,
    );

    it(
      "should reject JSON-LD with non-existent remote context",
      async () => {
        // Arrange - Using a definitely non-existent domain
        const invalidJsonLd = {
          "@context":
            "https://this-domain-definitely-does-not-exist-12345.com/context.json",
          type: "Person",
          name: "John Doe",
        };

        // Act
        const response = await request(app)
          .post("/commission")
          .send(invalidJsonLd)
          .timeout(TIMEOUT)
          .expect(400);

        // Assert
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Invalid JSON-LD format");
        expect(response.body).toHaveProperty("details");
        expect(response.body.details).toContain("Invalid JSON-LD");
      },
      TIMEOUT,
    );

    it(
      "should reject malformed JSON-LD structure",
      async () => {
        // Arrange - Invalid JSON-LD structure
        const invalidJsonLd = {
          just: "regular json",
          not: "json-ld at all",
        };

        // Act
        const response = await request(app)
          .post("/commission")
          .send(invalidJsonLd)
          .timeout(TIMEOUT)
          .expect(400);

        // Assert
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Invalid JSON-LD format");
      },
      TIMEOUT,
    );

    it(
      "should reject empty JSON-LD object",
      async () => {
        // Arrange
        const emptyJsonLd = {};

        // Act
        const response = await request(app)
          .post("/commission")
          .send(emptyJsonLd)
          .timeout(TIMEOUT)
          .expect(400);

        // Assert
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Invalid JSON-LD format");
      },
      TIMEOUT,
    );
  });

  describe("GET /resource/:id", () => {
    it(
      "should retrieve a commissioned resource by ID",
      async () => {
        // Arrange - First commission a resource
        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "Event",
          name: "Integration Test Event",
          description: "An event for testing",
          startDate: "2024-01-01T10:00:00Z",
        };

        const commissionResponse = await request(app)
          .post("/commission")
          .send(jsonLd)
          .timeout(TIMEOUT)
          .expect(201);

        const { id } = commissionResponse.body;

        // Act - Retrieve the resource
        const response = await request(app).get(`/resource/${id}`).expect(200);

        // Assert
        expect(response.body).toEqual(jsonLd);
      },
      TIMEOUT,
    );

    it("should return 404 for non-existent resource ID", async () => {
      // Act
      const response = await request(app)
        .get("/resource/550e8400-e29b-41d4-a716-446655440000") // Valid UUID format but doesn't exist
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        error: "Resource not found",
      });
    });

    it("should return 404 for malformed resource ID", async () => {
      // Act
      const response = await request(app)
        .get("/resource/invalid-id-format")
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        error: "Resource not found",
      });
    });
  });

  describe("POST /decommission", () => {
    it(
      "should successfully decommission an existing resource",
      async () => {
        // Arrange - First commission a resource
        const jsonLd = {
          "@context": {
            name: "https://schema.org/name",
            Product: "https://schema.org/Product",
          },
          "@type": "Product",
          name: "Test Product",
        };

        const commissionResponse = await request(app)
          .post("/commission")
          .send(jsonLd)
          .timeout(TIMEOUT)
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
      },
      TIMEOUT,
    );

    it("should return 404 when trying to decommission non-existent resource", async () => {
      // Act
      const response = await request(app)
        .post("/decommission")
        .send({ id: "550e8400-e29b-41d4-a716-446655440000" }) // Valid UUID but doesn't exist
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

  describe("Full workflow integration with real JSON-LD", () => {
    it(
      "should handle complete commission -> retrieve -> decommission workflow",
      async () => {
        // Arrange - Complex JSON-LD with multiple contexts
        const jsonLd = {
          "@context": [
            "https://www.w3.org/ns/activitystreams",
            {
              schema: "https://schema.org/",
              jobTitle: "schema:jobTitle",
              worksFor: "schema:worksFor",
            },
          ],
          type: "Person",
          name: "Integration Test Developer",
          summary: "A developer working on JSON-LD integration tests",
          jobTitle: "Senior Software Engineer",
          worksFor: {
            type: "Organization",
            name: "Test Corp",
          },
        };

        // Step 1: Commission
        const commissionResponse = await request(app)
          .post("/commission")
          .send(jsonLd)
          .timeout(TIMEOUT)
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
      },
      TIMEOUT,
    );

    it(
      "should handle multiple different JSON-LD resources simultaneously",
      async () => {
        // Arrange - Different types of JSON-LD
        const personJsonLd = {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Alice Johnson",
          email: "alice@example.com",
        };

        const organizationJsonLd = {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ACME Corporation",
          url: "https://acme.example.com",
        };

        const eventJsonLd = {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Event",
          name: "Annual Conference",
          summary: "Our yearly gathering",
        };

        // Commission all resources
        const [response1, response2, response3] = await Promise.all([
          request(app)
            .post("/commission")
            .send(personJsonLd)
            .timeout(TIMEOUT)
            .expect(201),
          request(app)
            .post("/commission")
            .send(organizationJsonLd)
            .timeout(TIMEOUT)
            .expect(201),
          request(app)
            .post("/commission")
            .send(eventJsonLd)
            .timeout(TIMEOUT)
            .expect(201),
        ]);

        const id1 = response1.body.id;
        const id2 = response2.body.id;
        const id3 = response3.body.id;

        // Verify all are different and exist
        expect(new Set([id1, id2, id3]).size).toBe(3); // All unique

        const [retrieve1, retrieve2, retrieve3] = await Promise.all([
          request(app).get(`/resource/${id1}`).expect(200),
          request(app).get(`/resource/${id2}`).expect(200),
          request(app).get(`/resource/${id3}`).expect(200),
        ]);

        expect(retrieve1.body).toEqual(personJsonLd);
        expect(retrieve2.body).toEqual(organizationJsonLd);
        expect(retrieve3.body).toEqual(eventJsonLd);

        // Decommission the middle one
        await request(app).post("/decommission").send({ id: id2 }).expect(200);

        // Verify selective removal
        await request(app).get(`/resource/${id1}`).expect(200);
        await request(app).get(`/resource/${id2}`).expect(404); // Removed
        await request(app).get(`/resource/${id3}`).expect(200);
      },
      TIMEOUT,
    );

    it(
      "should handle JSON-LD with complex nested structures",
      async () => {
        // Arrange - Complex nested JSON-LD
        const complexJsonLd = {
          "@context": {
            "@vocab": "https://schema.org/",
            activity: "https://www.w3.org/ns/activitystreams#",
          },
          "@type": "Organization",
          name: "Tech Innovations Inc.",
          description: "Leading technology solutions provider",
          foundingDate: "2010-01-15",
          employee: [
            {
              "@type": "Person",
              name: "Jane Smith",
              jobTitle: "CTO",
              email: "jane@techinnovations.com",
            },
            {
              "@type": "Person",
              name: "Bob Wilson",
              jobTitle: "Lead Developer",
              worksFor: {
                "@type": "Organization",
                name: "Tech Innovations Inc.",
              },
            },
          ],
          address: {
            "@type": "PostalAddress",
            streetAddress: "123 Innovation Drive",
            addressLocality: "Silicon Valley",
            addressRegion: "CA",
            postalCode: "94000",
            addressCountry: "US",
          },
        };

        // Act - Full workflow with complex structure
        const commissionResponse = await request(app)
          .post("/commission")
          .send(complexJsonLd)
          .timeout(TIMEOUT)
          .expect(201);

        const { id } = commissionResponse.body;

        const retrieveResponse = await request(app)
          .get(`/resource/${id}`)
          .expect(200);

        expect(retrieveResponse.body).toEqual(complexJsonLd);

        // Clean up
        await request(app).post("/decommission").send({ id }).expect(200);
      },
      TIMEOUT,
    );
  });

  describe("Network resilience tests", () => {
    it(
      "should handle slow but valid context resolution",
      async () => {
        // This test uses a real but potentially slower context
        const jsonLd = {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "Testing slow context resolution",
          published: "2024-01-01T12:00:00Z",
        };

        const response = await request(app)
          .post("/commission")
          .send(jsonLd)
          .timeout(TIMEOUT)
          .expect(201);

        expect(response.body).toHaveProperty("id");
      },
      TIMEOUT,
    );

    it(
      "should reject invalid context URLs gracefully",
      async () => {
        const jsonLd = {
          "@context": "https://httpstat.us/500", // Returns HTTP 500
          type: "Person",
          name: "Test",
        };

        const response = await request(app)
          .post("/commission")
          .send(jsonLd)
          .timeout(TIMEOUT)
          .expect(400);

        expect(response.body.error).toBe("Invalid JSON-LD format");
      },
      TIMEOUT,
    );
  });
});
