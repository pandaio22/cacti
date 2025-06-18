import {
  Checks,
  type Logger,
  LoggerProvider,
  type ILoggerOptions,
  LogLevelDesc,
} from "@hyperledger/cactus-common";
import {
  type IPluginWebService,
  type ICactusPlugin,
  type IWebServiceEndpoint,
  type ICactusPluginOptions,
  createAjvTypeGuard,
} from "@hyperledger/cactus-core-api";
import { v4 as uuidv4 } from "uuid";
import {
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  IsString,
} from "class-validator";
import { PluginRegistry } from "@hyperledger/cactus-core";
import express, { type Express } from "express";
import { TokenIssuanceAuthorizationRequestEndpoint } from "./entities/asset-schema-authority/endpoints/token-issuance-authorization-request-endpoint";
import { AssetSchemaAuthorityService } from "../typescript/entities/asset-schema-authority/modules/services/asset-schema-authority-service";
import { object } from "zod";

//TODO

export interface IPluginAssetSchemaArchitectureOptions
  extends ICactusPluginOptions {
  instanceId: string;
  readonly pluginRegistry: PluginRegistry;
  logLevel?: LogLevelDesc;
  disableSignalHandlers?: true;
}

export class PluginAssetSchemaArchitecture
  implements IPluginWebService, ICactusPlugin
{
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  private readonly logger: Logger;

  @IsString()
  public readonly instanceId: string;

  private endpoints: IWebServiceEndpoint[] | undefined;

  constructor(
    public readonly options: IPluginAssetSchemaArchitectureOptions,
    public readonly className: string = "PluginAssetSchemaArchitecture",
  ) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.instanceId, `${fnTag} options.instanceId`);

    const level = options.logLevel || "INFO";
    const logOptions: ILoggerOptions = {
      level: level,
      label: this.className,
    };
    this.logger = LoggerProvider.getOrCreate(logOptions);
    this.instanceId = uuidv4();

    this.logger.info("Initializing PluginAssetSchemaArchitecture");
  }

  /* ICactus Plugin methods */
  public getInstanceId(): string {
    return this.instanceId;
  }

  public getPackageName(): string {
    return "@hyperledger/cacti-asset-schema-architecture-plugin-satp";
  }

  public async onPluginInit(): Promise<undefined> {
    const fnTag = `${this.className}#onPluginInit()`;
    this.logger.trace(`Entering ${fnTag}`);
    //await Promise.all([this.startup()]);
    return undefined;
  }

  /* IPluginWebService methods */
  async registerWebServices(app: Express): Promise<IWebServiceEndpoint[]> {
    const webServices = await this.getOrCreateWebServices();
    for (const ws of webServices) {
      this.logger.debug(`Registering service ${ws.getPath()}`);
      ws.registerExpress(app);
    }
    return webServices;
  }

  public async getOrCreateWebServices(): Promise<IWebServiceEndpoint[]> {
    const fnTag = `${this.className}#getOrCreateWebServices()`;
    this.logger.info(
      `${fnTag}, Registering webservices on instanceId=${this.instanceId}`,
    );
    this.logger.trace(`Entering ${fnTag}`);

    if (Array.isArray(this.endpoints)) {
      return await this.endpoints;
    }

    const tokenIssuanceAuthorizationRequestEndpoint =
      new TokenIssuanceAuthorizationRequestEndpoint(
        new AssetSchemaAuthorityService(),
      );

    this.endpoints = [tokenIssuanceAuthorizationRequestEndpoint];

    return await this.endpoints;
  }

  public getOpenApiSpec(): unknown {
    return undefined; //this.OAS;
    /*
    This needs to be fixed. api-server installs some validation middleware using this
    and it was breaking the integration of the plugin with the api-server.
      Error: 404 not found - on all api requests when the middleware is installed.
    */
  }

  public async shutdown(): Promise<void> {
    const fnTag = `${this.className}#shutdown()`;
    this.logger.info(`Shutting down ${this.className}`);
    // Perform any necessary cleanup here
    return Promise.resolve();
  }
}
