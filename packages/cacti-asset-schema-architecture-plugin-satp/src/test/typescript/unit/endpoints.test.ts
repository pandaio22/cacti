import request from "supertest";
//import { v4 as uuidv4 } from "uuid";
import { Server } from "http";

// Import app without it calling .listen()
import app from "../../../main/typescript/endpoints/endpoints";

let server: Server;

beforeEach((done) => {
  server = app.listen(0, done); // Start server on random port
});

afterEach((done) => {
  server.close(done); // Properly close the server after each test
});

describe("TestEndpointsAPI", () => {
  let createdId: string;

  it("POST /commission - should create a new resource and return its ID", async () => {
    const response = await request(server).post("/commission").send({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Alice",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    createdId = response.body.id;
  });

  // Additional tests can be uncommented when you're ready:
  /*
  it("GET /resource/:id - should retrieve the previously created resource", async () => {
    const response = await request(server).get(`/resource/${createdId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("@type", "Person");
    expect(response.body).toHaveProperty("name", "Alice");
  });

  it("POST /decommission - should remove the resource", async () => {
    const response = await request(server)
      .post("/decommission")
      .send({ id: createdId });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/decommissioned/);
  });

  it("GET /resource/:id - should return 404 after decommission", async () => {
    const response = await request(server).get(`/resource/${createdId}`);
    expect(response.status).toBe(404);
  });

  it("POST /decommission with unknown ID - should return 404", async () => {
    const response = await request(server)
      .post("/decommission")
      .send({ id: uuidv4() });

    expect(response.status).toBe(404);
  });
  */
});
