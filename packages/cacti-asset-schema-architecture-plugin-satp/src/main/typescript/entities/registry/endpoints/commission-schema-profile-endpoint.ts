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
import {
  SignedSchemaProfile,
  CommissionedSchemaProfileID,
} from "../../../generated/asset-schema-architecture/typescript-axios/api";
import { IRegistryApiService } from "../../registry/modules/services/registry-api-service/interfaces/registry-api-service.interface";

export class CommissionSchemaProfileEndpoint implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "CommissionSchemaProfileEndpoint";

  private readonly log: Logger;

  public get className(): string {
    return CommissionSchemaProfileEndpoint.CLASS_NAME;
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

  public get oasPath(): (typeof OAS.paths)["/api/@hyperledger/cacti-asset-schema-architecture/registry/commission-schema-profile"] {
    return OAS.paths[
      "/api/@hyperledger/cacti-asset-schema-architecture/registry/commission-schema-profile"
    ];
  }
  public async registerExpress(
    expressApp: Express,
  ): Promise<IWebServiceEndpoint> {
    await registerWebServiceEndpoint(expressApp, this);
    return this;
  }

  getVerbLowerCase(): string {
    return this.oasPath.post["x-hyperledger-cacti"].http.verbLowerCase;
  }

  getPath(): string {
    return this.oasPath.post["x-hyperledger-cacti"].http.path;
  }

  public getExpressRequestHandler(): IExpressRequestHandler {
    return this.handleRequest.bind(this);
  }

  public getOperationId(): string {
    return OAS.paths[
      "/api/@hyperledger/cacti-asset-schema-architecture/registry/commission-schema-profile"
    ].post.operationId;
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
      const signedSchemaProfile: SignedSchemaProfile = req.body;
      const commissionedSchemaProfileID: CommissionedSchemaProfileID =
        await this.registryApiService.commissionSchemaProfile(
          signedSchemaProfile,
        );
      console.log("Commissioned Schema Profile:", commissionedSchemaProfileID);
      res.json(commissionedSchemaProfileID);
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
