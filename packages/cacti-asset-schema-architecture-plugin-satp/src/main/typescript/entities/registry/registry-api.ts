import express, { Express, Request, Response } from "express";
import { Server } from "http";
import { v4 as uuidv4 } from "uuid";
import bodyParser from "body-parser";
import { RegistryApiService } from "./modules/registry-api-service";

export class RegistryApi {
  public app: Express;
  private readonly port: number;
  private server?: Server;

  constructor(
    private readonly registryApiService: RegistryApiService,
    port: number = 3000,
  ) {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.post("/commission", (req: Request, res: Response) =>
      this.commissionAsset(req, res),
    );
    this.port = port;
  }
  public async start(): Promise<void> {
    this.server = await new Promise<Server>((resolve, reject) => {
      const server = this.app.listen(this.port, () => {
        console.log(`🚀 Server running at http://localhost:${this.port}`);
        resolve(server);
      });
      server.on("error", reject);
    });
  }

  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err?: Error) => {
          if (err) return reject(err);
          console.log("🛑 Server stopped.");
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
  private async commissionAsset(req: Request, res: Response): Promise<void> {
    const data = req.body;
    try {
      await this.registryApiService.commissionAsset(data);

      console.log(
        "No errors found in asset data, proceeding with commissioning.",
      );
      res.status(200).json({
        message: "Asset commissioned successfully",
        received: data,
      });
    } catch (error) {
      console.error("Error commissioning asset:", error);
      res.status(400).json({
        error: "Invalid asset data",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
