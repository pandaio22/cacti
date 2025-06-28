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
} from "@hyperledger/cactus-core-api";
import {
  ApiServer,
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
import http from "http";
import express, { type Express } from "express";
import bodyParser from "body-parser";
import {
  TokenIssuanceAuthorizationRequestEndpoint,
  AssetSchemaCertificationEndpoint,
  SchemaProfileCertificationEndpoint,
} from "./entities/asset-schema-authority/endpoints/asset-schema-authority-endpoints";
import {
  RegisterTokenAuthorizationEndpoint,
  CommissionAssetSchemaEndpoint,
  CommissionSchemaProfileEndpoint,
  CommissionTokenizedAssetRecordEndpoint,
  RegisterAssetSchemaAuthorityEndpoint,
  RegisterAssetProviderEndpoint,
  GetAssetSchemaEndpoint,
} from "./entities/registry/endpoints/registry-endpoints";
import { AssetSchemaAuthorityService } from "../typescript/entities/asset-schema-authority/modules/services/asset-schema-authority-service";
import { RegistryApiService } from "../typescript/entities/registry/modules/services/registry-api-service/implementations/registry-api-service";
import {
  EntityServerConfig,
  EntityServerType,
} from "./web-services/entity-server-config";

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

  private async shutdownWebServers(): Promise<void> {
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

    await this.registerEntityWebServices(type, expressApp);
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

  async registerWebServices(app: Express): Promise<IWebServiceEndpoint[]> {
    const webServices: IWebServiceEndpoint[] =
      await this.getOrCreateWebServices();

    for (const ws of webServices) {
      this.logger.debug(`Registering service ${ws.getPath()}`);
      ws.registerExpress(app);
    }
    return webServices;
  }

  private async registerEntityWebServices(
    type: EntityServerType,
    app: Express,
  ): Promise<IWebServiceEndpoint[]> {
    const webServices: IWebServiceEndpoint[] =
      await this.getOrCreateWebServices();
    this.logger.debug(`Webservices: ${JSON.stringify(webServices, null, 2)}`);

    const entityWebServices: IWebServiceEndpoint[] =
      await this.filterApiEndpoints(type, webServices);
    this.logger.debug(
      `${type} Webservices: ${JSON.stringify(entityWebServices, null, 2)}`,
    );

    for (const ws of entityWebServices) {
      this.logger.debug(`Registering service ${ws.getPath()}`);
      ws.registerExpress(app);
    }
    return webServices;
  }

  private async filterApiEndpoints(
    targetEntity: EntityServerType,
    webServices: IWebServiceEndpoint[],
  ): Promise<IWebServiceEndpoint[]> {
    const fnTag = `${this.className}#filterApiEndpoints()`;

    const basePath = this.entityServerConfig
      .getServerUrl(targetEntity)
      // Remove host and port from URL to extract just the path:
      .replace(/^https?:\/\/[^\/]+/, "");

    this.logger.debug(
      `${fnTag} - Filtering endpoints for entity: ${targetEntity}`,
    );
    this.logger.debug(`${fnTag} - Expected basePath: ${basePath}`);

    const filtered = webServices.filter((ws) => {
      const path = ws.getPath();
      const matches = path.startsWith(basePath);
      if (matches) {
        this.logger.debug(`${fnTag} - Matched endpoint: ${path}`);
      }
      return matches;
    });

    this.logger.debug(
      `${fnTag} - Found ${filtered.length} matching endpoint(s).`,
    );
    return filtered;
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

    /*ASSET SCHEMA AUTHORITY ENDPOINTS*/
    const tokenIssuanceAuthorizationRequestEndpoint =
      new TokenIssuanceAuthorizationRequestEndpoint(
        new AssetSchemaAuthorityService(),
      );

    const assetSchemaCertificationEndpoint =
      new AssetSchemaCertificationEndpoint(new AssetSchemaAuthorityService());

    const schemaProfileCertificationEndpoint =
      new SchemaProfileCertificationEndpoint(new AssetSchemaAuthorityService());

    /*REGISTRY ENDPOINTS*/
    const commissionAssetSchemaEndpoint = new CommissionAssetSchemaEndpoint(
      new RegistryApiService(),
    );
    const commissionSchemaProfileEndpoint = new CommissionSchemaProfileEndpoint(
      new RegistryApiService(),
    );
    const commissionTokenizedAssetRecord =
      new CommissionTokenizedAssetRecordEndpoint(new RegistryApiService());
    const registerTokenAuthorizationEndpoint =
      new RegisterTokenAuthorizationEndpoint(new RegistryApiService());
    const registerAssetSchemaAuthorityEndpoint =
      new RegisterAssetSchemaAuthorityEndpoint(new RegistryApiService());
    const registerAssetProviderEndpoint = new RegisterAssetProviderEndpoint(
      new RegistryApiService(),
    );
    const getAssetSchemaEndpoint = new GetAssetSchemaEndpoint(
      new RegistryApiService(),
    );

    this.endpoints = [
      assetSchemaCertificationEndpoint,
      schemaProfileCertificationEndpoint,
      tokenIssuanceAuthorizationRequestEndpoint,
      commissionAssetSchemaEndpoint,
      commissionSchemaProfileEndpoint,
      commissionTokenizedAssetRecord,
      registerTokenAuthorizationEndpoint,
      registerAssetSchemaAuthorityEndpoint,
      registerAssetProviderEndpoint,
      getAssetSchemaEndpoint,
    ];

    return await this.endpoints;
  }
  /*******************************/
}
