/*import express, { Express, Request, Response } from "express";
import { Server } from "http";
import bodyParser from "body-parser";
import { AssetSchemaAuthorityService } from "./modules/services/asset-schema-authority-service";
import { API_ENDPOINTS } from "../../constants/constants";

export class AssetSchemaAuthorityApi {
  public app: Express;
  private readonly port: number;
  private server?: Server;
  /**
   * Constructs a new instance of the AssetSchemaAuthorityApi.
   * @param assetSchemaAuthorityService - An instance of the AssetSchemaAuthorityService to handle API requests.
   * @param port - The port on which the server will listen (default is 3000).
   * 
  constructor(
    private readonly assetSchemaAuthorityService: AssetSchemaAuthorityService,
    port: number = 3010,
  ) {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.post(
      API_ENDPOINTS.ASSET_SCHEMA_AUTHORITY.CERTIFICATE_ASSET_SCHEMA,
      (req: Request, res: Response) => this.certificateAssetSchema(req, res),
    );
    this.app.post(
      API_ENDPOINTS.ASSET_SCHEMA_AUTHORITY.CERTIFICATE_SCHEMA_PROFILE,
      (req: Request, res: Response) => this.certificateSchemaProfile(req, res),
    );
    this.port = port;
  }
  /**
   * Starts the server and listens on the specified port.
   * @returns A promise that resolves when the server is successfully started.
   
  public async start(): Promise<void> {
    this.server = await new Promise<Server>((resolve, reject) => {
      const server = this.app.listen(this.port, () => {
        console.log(
          `🚀 Asset Schema Authority API running at http://localhost:${this.port}`,
        );
        resolve(server);
      });
      server.on("error", reject);
    });
  }

  /**
   * Stops the server if it is running.
   * @returns A promise that resolves when the server is successfully stopped.
   
  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err?: Error) => {
          if (err) return reject(err);
          console.log("🛑 Asset Schema Authority API stopped.");
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
  /**
   * API endpoint to issue a certificate for an asset schema.
   * @param req - The request object containing the asset schema data.
   * @param res - The response object to send the result.
   
  private async certificateAssetSchema(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const assetSchema = req.body;
      console.log("Received asset schema for certification:", assetSchema);
      if (!assetSchema) {
        throw new Error("Asset schema are required to issue a certificate.");
      }
      const certifiedAssetSchema =
        await this.assetSchemaAuthorityService.signAssetSchema(assetSchema);

      res.status(200).json({
        message: "Asset schema certified successfully",
        received: certifiedAssetSchema,
      });
    } catch (error) {
      console.error("Error issuing certificate:", error);
      const errorStatus = (error as any)?.status ?? 400;
      res.status(errorStatus).json({
        error: "Invalid asset schema data",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async certificateSchemaProfile(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const schemaProfile = req.body;
      console.log("Received schema profile for certification:", schemaProfile);
      if (!schemaProfile) {
        throw new Error("Schema profile is required to issue a certificate.");
      }
      const certifiedSchemaProfile =
        await this.assetSchemaAuthorityService.signSchemaProfile(schemaProfile);

      res.status(200).json({
        message: "Schema profile certified successfully",
        received: certifiedSchemaProfile,
      });
    } catch (error) {
      console.error("Error issuing certificate:", error);
      const errorStatus = (error as any)?.status ?? 400;
      res.status(errorStatus).json({
        error: "Invalid schema profile data",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
*/