export type EntityServerType =
  | "registry"
  | "assetSchemaAuthority"
  | "assetProvider";

interface EntityServerDefinition {
  type: EntityServerType;
  description: string;
  defaultHost: string;
  defaultPort: number;
  basePath: string;
}

const ENTITY_SERVER_DEFINITIONS: EntityServerDefinition[] = [
  {
    type: "registry",
    description: "Registry server",
    defaultHost: "localhost",
    defaultPort: 3000,
    basePath: "/api/@hyperledger/cacti-asset-schema-architecture/registry",
  },
  {
    type: "assetSchemaAuthority",
    description: "Asset Schema Authority server",
    defaultHost: "localhost",
    defaultPort: 3010,
    basePath:
      "/api/@hyperledger/cacti-asset-schema-architecture/asset-schema-authority",
  },
  {
    type: "assetProvider",
    description: "Asset Provider server",
    defaultHost: "localhost",
    defaultPort: 3020,
    basePath:
      "/api/@hyperledger/cacti-asset-schema-architecture/asset-provider",
  },
];

export interface EntityServerOverride {
  host?: string;
  port?: number;
}

export class EntityServerConfig {
  private overrides: Partial<Record<EntityServerType, EntityServerOverride>> =
    {};

  constructor(
    overrides?: Partial<Record<EntityServerType, EntityServerOverride>>,
  ) {
    if (overrides) {
      this.overrides = overrides;
    }
  }

  public getServerUrl(entityServerType: EntityServerType): string {
    const definition = ENTITY_SERVER_DEFINITIONS.find(
      (s) => s.type === entityServerType,
    );
    if (!definition) {
      throw new Error(`Unknown server type: ${entityServerType}`);
    }

    const override = this.overrides[entityServerType] || {};
    const host = override.host || definition.defaultHost;
    const port = override.port ?? definition.defaultPort;
    return `http://${host}:${port}${definition.basePath}`;
  }

  public setOverride(
    entityServerType: EntityServerType,
    override: EntityServerOverride,
  ): void {
    this.overrides[entityServerType] = override;
  }

  public getOverrides(): Partial<
    Record<EntityServerType, EntityServerOverride>
  > {
    return this.overrides;
  }
}
