import {
  IAsyncProvider,
  Logger,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import {
  IEndpointAuthzOptions,
  IExpressRequestHandler,
  IWebServiceEndpoint,
} from "@hyperledger/cactus-core-api";
import type { Express, Request, Response } from "express";
import {
  handleRestEndpointException,
  registerWebServiceEndpoint,
} from "@hyperledger/cactus-core";
import OAS from "../../../../json/openapi-asset-schema-architecture-bundled.json";
import { AssetProviderCertificate } from "../../../generated/asset-schema-architecture/typescript-axios/api";
import { IRegistryApiService } from "../../registry/modules/services/registry-api-service/interfaces/registry-api-service.interface";

export class GetAssetProviderEndpoint implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "GetAssetProviderEndpoint";

  private readonly log: Logger;

  public get className(): string {
    return GetAssetProviderEndpoint.CLASS_NAME;
  }

  constructor(private readonly registryApiService: IRegistryApiService) {
    //const fnTag = `${this.className}#constructor()`;
    //Checks.truthy(options, `${fnTag} arg options`);
    //Checks.truthy(options.dispatcher, `${fnTag} arg options.connector`);

    //const level = this.options.logLevel || "INFO";
    const level = "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public get oasPath(): (typeof OAS.paths)["/api/@hyperledger/cacti-asset-schema-architecture/registry/get-asset-provider"] {
    return OAS.paths[
      "/api/@hyperledger/cacti-asset-schema-architecture/registry/get-asset-provider"
    ];
  }
  public async registerExpress(
    expressApp: Express,
  ): Promise<IWebServiceEndpoint> {
    await registerWebServiceEndpoint(expressApp, this);
    return this;
  }

  getVerbLowerCase(): string {
    return this.oasPath.get["x-hyperledger-cacti"].http.verbLowerCase;
  }

  getPath(): string {
    return this.oasPath.get["x-hyperledger-cacti"].http.path;
  }

  public getExpressRequestHandler(): IExpressRequestHandler {
    return this.handleRequest.bind(this);
  }

  public getOperationId(): string {
    return OAS.paths[
      "/api/@hyperledger/cacti-asset-schema-architecture/registry/get-asset-provider"
    ].get.operationId;
  }

  getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions> {
    return {
      get: async () => ({
        isProtected: true,
        requiredRoles: [],
      }),
    };
  }
  public async handleRequest(req: Request, res: Response): Promise<void> {
    const fnTag = `${this.className}#handleRequest()`;
    const reqTag = `${this.getVerbLowerCase()} - ${this.getPath()}`;

    try {
      const uid = req.query.uid;
      if (!uid || typeof uid !== "string")
        throw new Error("Missing or invalid 'UniqueId' query parameter.");

      const assetProviderCertificate: AssetProviderCertificate =
        await this.registryApiService.getAssetProvider(uid);

      if (!assetProviderCertificate) {
        throw new Error("Asset Provider not found.");
      }

      console.log("Retrieved Asset Provider:", assetProviderCertificate);
      res.json(assetProviderCertificate);
    } catch (exception) {
      const errorMsg = `${reqTag} ${fnTag} Failed to transact: ${exception}`;
      handleRestEndpointException({
        errorMsg,
        log: this.log,
        error: exception,
        res,
      });
    }
  }
}
