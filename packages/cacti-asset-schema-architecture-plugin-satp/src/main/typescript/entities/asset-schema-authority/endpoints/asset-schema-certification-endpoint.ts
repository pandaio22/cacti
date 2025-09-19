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
  AssetSchema,
  CommissionedAssetSchema,
} from "../../../generated/asset-schema-architecture/typescript-axios/api";
import { AssetSchemaAuthorityService } from "../modules/services/asset-schema-authority-service/implementations/asset-schema-authority-service";

export class AssetSchemaCertificationEndpoint implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "AssetSchemaCertificationEndpoint";

  private readonly log: Logger;

  public get className(): string {
    return AssetSchemaCertificationEndpoint.CLASS_NAME;
  }

  constructor(
    private readonly assetSchemaAuthorityService: AssetSchemaAuthorityService,
  ) {
    //const fnTag = `${this.className}#constructor()`;
    //Checks.truthy(options, `${fnTag} arg options`);
    //Checks.truthy(options.dispatcher, `${fnTag} arg options.connector`);

    //const level = this.options.logLevel || "INFO";
    const level = "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public get oasPath(): (typeof OAS.paths)["/api/@hyperledger/cacti-asset-schema-architecture/asset-schema-authority/asset-schema-certification"] {
    return OAS.paths[
      "/api/@hyperledger/cacti-asset-schema-architecture/asset-schema-authority/asset-schema-certification"
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
      "/api/@hyperledger/cacti-asset-schema-architecture/asset-schema-authority/asset-schema-certification"
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
      const { assetSchema, assetSchemaDidDocument } = req.body;
      const commissionedAssetSchema: CommissionedAssetSchema =
        await this.assetSchemaAuthorityService.certifyAssetSchema(
          assetSchema,
          assetSchemaDidDocument,
        );
      console.log(commissionedAssetSchema);
      res.json(commissionedAssetSchema);
      /*const assetSchema: AssetSchema = req.body;
      const signedAssetSchema =
        await this.assetSchemaAuthorityService.handleAssetSchemaCertification(
          assetSchema,
        );
      res.json(signedAssetSchema);*/
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
