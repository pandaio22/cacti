import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bodyParser from "body-parser";

const app = express();
//const port = 3000;

// Middleware
app.use(bodyParser.json());

// In-memory storage for commissioned JSON-LD data
const store = new Map<string, any>();

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
*/
// POST /commission endpoint to add new JSON-LD data
app.post("/commission", (req: Request, res: Response) => {
  const jsonLd = req.body;

  console.log("Received /commission request:", JSON.stringify(jsonLd, null, 2));

  // Validate JSON-LD structure (basic validation)
  
  // Use an hash for the id
  const id = uuidv4();

  console.log(`Storing resource with ID: ${id}`);
  console.log("Stored value:", JSON.stringify(jsonLd, null, 2));

  store.set(id, jsonLd);

  res.status(201).json({ id });
});

/*
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
//app.listen(port, () => {
//  console.log(`Server running at http://localhost:${port}`);
//});

export default app;
