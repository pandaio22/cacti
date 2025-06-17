import {
  type Logger,
  LoggerProvider,
  type ILoggerOptions,
  LogLevelDesc,
} from "@hyperledger/cactus-common";
import type {
  IPluginWebService,
  ICactusPlugin,
  IWebServiceEndpoint,
  ICactusPluginOptions,
} from "@hyperledger/cactus-core-api";
import { v4 as uuidv4 } from "uuid";
import {
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  IsString,
} from "class-validator";
import express, { type Express } from "express";

//TODO

export class PluginAssetSchemaArchitecture
  implements IPluginWebService, ICactusPlugin
{
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  private readonly logger: Logger;

  @IsString()
  public readonly instanceId: string;

  constructor(
    public readonly opts: ICactusPluginOptions,
    public readonly className: string = "PluginAssetSchemaArchitecture",
    public readonly logLevel: LogLevelDesc = "INFO",
  ) {
    const level = "INFO";
    const logOptions: ILoggerOptions = {
      level: level,
      label: this.className,
    };
    this.logger = LoggerProvider.getOrCreate(logOptions);
    this.logger.info("Initializing PluginAssetSchemaArchitecture");
    this.instanceId = uuidv4();
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
    this.logger.trace(`Entering ${fnTag}`);
    return await new Promise<IWebServiceEndpoint[]>((resolve) => {
      this.logger.debug(
        `Returning empty array for web services in ${this.className}`,
      );
    });
  }

  public async getWebServiceEndpoints(): Promise<IWebServiceEndpoint[]> {
    // Return the web service endpoints provided by this plugin
    return [];
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
