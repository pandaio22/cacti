import express, { Express, Request, Response } from "express";
import { Server } from "http";
//import { v4 as uuidv4 } from "uuid";
import bodyParser from "body-parser";
import { RegistryApiService } from "./modules/registry-api-service";
import { API_ENDPOINTS } from "../../constants/constants";

export class RegistryApi {
  public app: Express;
  private readonly port: number;
  private server?: Server;

  /**
   * Constructs a new instance of the RegistryApi.
   * @param registryApiService - An instance of the RegistryApiService to handle API requests.
   * @param port - The port on which the server will listen (default is 3000).
   */
  constructor(
    private readonly registryApiService: RegistryApiService,
    port: number = 3000,
  ) {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.post(
      API_ENDPOINTS.REGISTRY.COMMISSION_ASSET_SCHEMA,
      (req: Request, res: Response) => this.commissionAssetSchemaApi(req, res),
    );
    this.app.post(
      API_ENDPOINTS.REGISTRY.COMMISSION_SCHEMA_PROFILE,
      (req: Request, res: Response) =>
        this.commissionSchemaProfileApi(req, res),
    );
    this.app.post(
      API_ENDPOINTS.REGISTRY.COMMISSION_TOKENIZED_ASSET_RECORD,
      (req: Request, res: Response) =>
        this.commissionTokenizedAssetRecordApi(req, res),
    );
    this.app.get(
      API_ENDPOINTS.REGISTRY.GET_ASSET_SCHEMA,
      (req: Request, res: Response) => this.getAssetSchemaApi(req, res),
    );
    this.port = port;
  }
  /**
   * Starts the server and listens on the specified port.
   * @returns A promise that resolves when the server is successfully started.
   */
  public async start(): Promise<void> {
    this.server = await new Promise<Server>((resolve, reject) => {
      const server = this.app.listen(this.port, () => {
        console.log(`🚀 Server running at http://localhost:${this.port}`);
        resolve(server);
      });
      server.on("error", reject);
    });
  }

  /**
   * Stops the server if it is running.
   * @returns A promise that resolves when the server is successfully stopped.
   */
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
  /**
   * Retrieves an asset schema by its unique identifier (UID).
   * @param req - The request object containing the UID in the URL parameters.
   * @param res - The response object to send the asset schema or an error message.
   */
  private async getAssetSchemaApi(req: Request, res: Response): Promise<void> {
    const uid = req.params.uid;

    try {
      const assetSchema: any =
        await this.registryApiService.getAssetSchemaById(uid);
      console.log(
        `Asset schema retrieved successfully with unique identifier: ${uid}`,
      );
      res.status(200).json({
        message: "Asset schema retrieved successfully",
        assetSchema: assetSchema,
      });
    } catch (error) {
      console.error("Error retrieving asset schema:", error);
      const errorStatus = (error as any)?.status ?? 400;
      res.status(errorStatus).json({
        error: "Invalid unique identifier for asset schema",
        details: error instanceof Error ? error.message : String(error),
      });
      return;
    }
  }
  /**
   * Commissions an asset schema by validating its data and adding it to IPFS.
   * @param req - The request object containing the asset schema data in the body.
   * @param res - The response object to send the result of the commissioning process.
   */
  private async commissionAssetSchemaApi(
    req: Request,
    res: Response,
  ): Promise<void> {
    const data = req.body;

    try {
      const schemaId: string =
        await this.registryApiService.commissionAssetSchema(data);
      console.log(
        `Asset schema commissioned successfully with schema ID: ${schemaId}`,
      );
      res.status(200).json({
        message: "Asset schema commissioned successfully",
        schemaId: schemaId,
        received: data,
      });
    } catch (error) {
      console.error("Error commissioning asset schema:", error);
      const errorStatus = (error as any)?.status ?? 400;

      res.status(errorStatus).json({
        error: "Invalid asset schema data",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
  /**
   * Commissions a schema profile by validating its data and adding it to IPFS.
   * @param req - The request object containing the schema profile data in the body.
   * @param res - The response object to send the result of the commissioning process.
   */
  private async commissionSchemaProfileApi(
    req: Request,
    res: Response,
  ): Promise<void> {
    const data = req.body;
    try {
      const schemaId: string =
        await this.registryApiService.commissionSchemaProfile(data);
      console.log(
        `Schema Profile commissioned successfully with schema ID: ${schemaId}`,
      );
      res.status(200).json({
        message: "Schema Profile commissioned successfully",
        schemaId: schemaId,
        received: data,
      });
    } catch (error) {
      console.error("Error commissioning Schema Profile:", error);
      const errorStatus = (error as any)?.status ?? 400;
      res.status(errorStatus).json({
        error: "Invalid schema profile data",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
  /**
   * Commissions a tokenized asset record by validating its data and adding it to IPFS.
   * @param req - The request object containing the tokenized asset record data in the body.
   * @param res - The response object to send the result of the commissioning process.
   */
  private async commissionTokenizedAssetRecordApi(
    req: Request,
    res: Response,
  ): Promise<void> {
    const data = req.body;
    try {
      const tokenizedAssetRecordId: string =
        await this.registryApiService.commissionTokenizedAssetRecord(data);
      console.log(
        `Tokenized Asset Record commissioned successfully with record ID: ${tokenizedAssetRecordId}`,
      );
      res.status(200).json({
        message: "Tokenized Asset Record commissioned successfully",
        tokenizedAssetRecordId: tokenizedAssetRecordId,
        received: data,
      });
    } catch (error) {
      console.error("Error commissioning Tokenized Asset Record:", error);
      const errorStatus = (error as any)?.status ?? 400;
      res.status(errorStatus).json({
        error: "Invalid tokenized asset record data",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
