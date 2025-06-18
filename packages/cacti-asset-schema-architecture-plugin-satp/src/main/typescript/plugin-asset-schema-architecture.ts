import {
  Checks,
  type Logger,
  LoggerProvider,
  type ILoggerOptions,
  IListenOptions,
  LogLevelDesc,
  Servers,
} from "@hyperledger/cactus-common";
import {
  type IPluginWebService,
  type ICactusPlugin,
  type IWebServiceEndpoint,
  type ICactusPluginOptions,
  createAjvTypeGuard,
} from "@hyperledger/cactus-core-api";
import {
  ApiServer,
  AuthorizationProtocol,
  ConfigService,
  ICactusApiServerOptions,
} from "@hyperledger/cactus-cmd-api-server";
import { v4 as uuidv4 } from "uuid";
import {
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  IsString,
} from "class-validator";
import { PluginRegistry } from "@hyperledger/cactus-core";
import http, { Server } from "http";
import express, { type Express } from "express";
import bodyParser from "body-parser";
import { TokenIssuanceAuthorizationRequestEndpoint } from "./entities/asset-schema-authority/endpoints/token-issuance-authorization-request-endpoint";
import { DefaultApi as AssetSchemaArchitectureApi } from "../../main/typescript/generated/asset-schema-architecture/typescript-axios/api";
import { AssetSchemaAuthorityService } from "../typescript/entities/asset-schema-authority/modules/services/asset-schema-authority-service";
import { object } from "zod";
import {
  EntityServerConfig,
  EntityServerType,
} from "./web-services/entity-server-config";
import { AddressInfo } from "net";

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

  private entityServerConfig: EntityServerConfig;
  private webServers: Map<EntityServerType, ApiServer> = new Map();
  private endpoints: IWebServiceEndpoint[] | undefined;
  private isShuttingDown: boolean = false;

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
    this.entityServerConfig = new EntityServerConfig();
  }

  /* Startup methods */
  public async startup(): Promise<void> {
    const fnTag = `${this.className}#startup()`;
    this.logger.info(
      `${fnTag}, Starting up the Asset Schema Architecture Plugin with instanceId=${this.instanceId}...`,
    );
    this.logger.trace(`Entering ${fnTag}`);

    //setup Servers -> Setup Endpoints
    await this.createWebServers();
  }

  //TODO
  public async onPluginInit(): Promise<undefined> {
    const fnTag = `${this.className}#onPluginInit()`;
    this.logger.trace(`Entering ${fnTag}`);

    await Promise.all([await this.startup()]);
  }
  /*******************************/

  /* Shutdown methods */
  //TODO
  public async shutdown(): Promise<void> {
    const fnTag = `${this.className}#shutdown()`;
    this.logger.info(
      `${fnTag}, Shutting down ${this.className} with instanceId=${this.instanceId}...`,
    );
    this.logger.trace(`Entering ${fnTag}`);

    if (this.isShuttingDown) {
      this.logger.info("API server shutdown already in progress, skipping.");
      return;
    }
    this.isShuttingDown = true;

    // Perform any necessary cleanup here
    await this.shutdownWebServers();
  }

  async shutdownWebServers(): Promise<void> {
    const fnTag = `${this.className}#shutdownWebServers()`;
    this.logger.info(`${fnTag}, Shutting down web servers...`);

    for (const [type, server] of this.webServers.entries()) {
      try {
        await server.shutdown();
        this.logger.info(`${fnTag}, Successfully shut down server for ${type}`);
      } catch (err) {
        this.logger.error(
          `${fnTag}, Failed to shut down server for ${type}:`,
          err,
        );
      }
    }

    this.webServers.clear();

    this.logger.info(`${fnTag}, All web servers shut down`);
  }

  /*******************************/

  /* Getters */
  public getInstanceId(): string {
    return this.instanceId;
  }

  public getPackageName(): string {
    return "@hyperledger/cacti-asset-schema-architecture-plugin-satp";
  }

  public getWebServices(): IWebServiceEndpoint[] | undefined {
    return this.endpoints;
  }

  public getWebServers(): Map<EntityServerType, ApiServer> {
    return this.webServers;
  }

  //TODO
  public getOpenApiSpec(): unknown {
    return undefined; //this.OAS;
    /*
    This needs to be fixed. api-server installs some validation middleware using this
    and it was breaking the integration of the plugin with the api-server.
      Error: 404 not found - on all api requests when the middleware is installed.
    */
  }

  /* WebServices methods */
  public async createWebServers(): Promise<void> {
    const fnTag = `${this.className}#getOrCreateWebServices()`;
    this.logger.info(
      `${fnTag}, Creating web servers on instanceId=${this.instanceId}`,
    );
    this.logger.trace(`Entering ${fnTag}`);

    const serverTypes: EntityServerType[] = [
      "registry",
      "assetSchemaAuthority",
      "assetProvider",
    ];

    await Promise.all(
      serverTypes.map(async (type) => {
        if (!this.webServers.has(type)) {
          const server = await this.createHttpServer(type);
          this.webServers.set(type, server);
          this.logger.info(`${fnTag}, Created server for ${type}`);
        } else {
          this.logger.debug(`${fnTag}, Server for ${type} already exists`);
        }
      }),
    );
    //Define a type for entity object
    //for each EntityServerConfig, create a Web Server by calling getOrCreateHttpServer()
  }

  private async createHttpServer(type: EntityServerType): Promise<ApiServer> {
    const fnTag = `${this.className}#getOrCreateHttpServer(${type})`;
    this.logger.trace(`Entering ${fnTag}`);

    const pluginRegistry = new PluginRegistry({ plugins: [this] });

    const url = this.entityServerConfig.getServerUrl(type);
    const { hostname, port } = new URL(url);

    const expressApp = express();
    expressApp.use(
      bodyParser.json({
        type: ["application/json", "application/ld+json"],
        limit: "250mb",
      }),
    );

    const httpServer = http.createServer(expressApp);

    const listenOptions: IListenOptions = {
      hostname,
      port: parseInt(port),
      server: httpServer,
    };

    await this.registerWebServices(expressApp);

    await Servers.listen(listenOptions);
    this.logger.info(`${fnTag} listening on ${url}`);

    //MUST CHANGE
    const config: ICactusApiServerOptions =
      await new ConfigService().newExampleConfig();

    const apiServer = new ApiServer({
      config: config,
      httpServerApi: httpServer,
      pluginRegistry: pluginRegistry,
    });
    return apiServer;
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

  async registerWebServices(app: Express): Promise<IWebServiceEndpoint[]> {
    const webServices = await this.getOrCreateWebServices();
    for (const ws of webServices) {
      this.logger.debug(`Registering service ${ws.getPath()}`);
      ws.registerExpress(app);
    }
    return webServices;
  }
  /*******************************/
}
