import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bodyParser from "body-parser";
import { JsonLdValidator } from "../validation/json-ld-validator.js";

const app = express();

// Middleware
app.use(bodyParser.json());

// In-memory storage for commissioned JSON-LD data
const store = new Map<string, any>();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Cacti Asset Schema Architecture Plugin (SATP) API!");
});
// POST /commission endpoint to add new JSON-LD data
app.post("/commission", async (req: Request, res: Response) => {
  const jsonLd = req.body;

  console.log("Received /commission request:", JSON.stringify(jsonLd, null, 2));

  try {
    //await JsonLdValidator.validate(jsonLd);
    if (jsonLd["@context"] === undefined) {
      console.log("Throw error");
      throw new Error("Missing @context in JSON-LD");
    }
    const id = uuidv4();

    console.log(`Storing resource with ID: ${id}`);
    console.log("Stored value:", JSON.stringify(jsonLd, null, 2));

    store.set(id, jsonLd);

    res.status(201).json({ id });
  } catch (error) {
    console.error(
      "JSON-LD validation failed:",
      error instanceof Error ? error.message : String(error),
    );
    res.status(400).json({
      error: "Invalid JSON-LD format",
      details: error.message,
    });
  }
});
/*
// GET endpoint to fetch JSON-LD by ID
app.get("/resource/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const jsonLd = store.get(id);

  if (!jsonLd) {
    return res.status(404).json({ error: "Resource not found" });
  }

  res.json(jsonLd);
});

// POST /decommission endpoint to remove resource by ID
app.post("/decommission", (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id || !store.has(id)) {
    return res.status(404).json({ error: "Resource not found or invalid ID" });
  }

  store.delete(id);

  res.json({ message: `Resource with ID ${id} decommissioned.` });
});
*/
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
export default app;
