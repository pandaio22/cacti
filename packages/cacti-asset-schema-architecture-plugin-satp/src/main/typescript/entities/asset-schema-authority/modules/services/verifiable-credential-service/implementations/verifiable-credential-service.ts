import {
  createAgent,
  ICredentialPlugin,
  IDIDManager,
  IKeyManager,
  IResolver,
  TAgent,
  VerifiableCredential,
} from "@veramo/core";
import {
  CredentialIssuerLD,
  LdDefaultContexts,
  VeramoEd25519Signature2020,
} from "@veramo/credential-ld";
import { CredentialPlugin } from "@veramo/credential-w3c";
import { DIDResolverPlugin } from "@veramo/did-resolver";
import {
  KeyManager,
  MemoryKeyStore,
  MemoryPrivateKeyStore,
} from "@veramo/key-manager";
import { KeyManagementSystem } from "@veramo/kms-local";
import { DIDManager, MemoryDIDStore } from "@veramo/did-manager";
import { WebDIDProvider } from "@veramo/did-provider-web";
import { EthrDIDProvider } from "@veramo/did-provider-ethr";
import { getResolver as ethrDidResolver } from "ethr-did-resolver";
import { getResolver as webDidResolver } from "web-did-resolver";
import { Resolver } from "did-resolver";

import jsonld from "jsonld";

//import * as Ed25519Multikey from "@digitalbazaar/ed25519-multikey";
//import { DataIntegrityProof } from "@digitalbazaar/data-integrity";
//import { cryptosuite as eddsaRdfc2022CryptoSuite } from "@digitalbazaar/eddsa-rdfc-2022-cryptosuite";

//import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";
//import { Ed25519Signature2020 } from "@digitalbazaar/ed25519-signature-2020";
//import * as vc from "@digitalbazaar/vc";

import {
  AssetSchema,
  AssetSchemaDidDocument,
  AssetSchemaVerifiableCredential,
  SchemaProfile,
  //SchemaProfileVerifiableCredential,
  SchemaProfileDidDocument,
  TokenIssuanceAuthorizationRequest,
  TokenIssuanceAuthorization,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";
import {
  ValidationErrorDetail,
  ValidationErrorType,
  ValidationResult,
} from "../../../../../../types/asset-schema-architecture-types.type";
import { createCustomLoader } from "../../../../../../utils/custom-loader";
import { createVeramoDocumentLoader } from "../../../../../../utils/custom-veramo-loader";
import { IVerifiableCredentialService } from "../interfaces/verifiable-credential-service.interface";

type ConfiguredAgent = TAgent<
  IDIDManager & IKeyManager & IResolver & ICredentialPlugin
>;

export class VerifiableCredentialService
  implements IVerifiableCredentialService
{
  private localContexts: Map<string, any>;
  private documentLoader: any;
  private contexts: [Map<string, any>];
  private localContextsObj: any;
  private agent: ConfiguredAgent;
  private ASSET_SCHEMA_AUTHORITY_DID =
    "did:web:example.com:asset-schema-authority";

  constructor(localContexts?: Map<string, any>) {
    this.contexts = [LdDefaultContexts];
    this.agent = this.createAgent();
    this.documentLoader = localContexts
      ? createCustomLoader(localContexts)
      : undefined;

    if (localContexts) {
      this.localContexts = localContexts;
      this.contexts = [new Map([...LdDefaultContexts, ...localContexts])];
      console.log("Using custom contexts for Veramo agent:", this.contexts);

      (jsonld as any).documentLoader = createCustomLoader(this.localContexts);
    } else {
      this.localContexts = LdDefaultContexts;
      (jsonld as any).documentLoader = LdDefaultContexts;
    }
  }

  public getAgent(): ConfiguredAgent {
    return this.agent;
  }

  private createAgent(): ConfiguredAgent {
    return createAgent<
      IDIDManager & IKeyManager & IResolver & ICredentialPlugin
    >({
      plugins: [
        new KeyManager({
          store: new MemoryKeyStore(),
          kms: {
            local: new KeyManagementSystem(new MemoryPrivateKeyStore()),
          },
        }),
        new DIDManager({
          store: new MemoryDIDStore(),
          defaultProvider: "did:web",
          providers: {
            "did:web": new WebDIDProvider({
              defaultKms: "local",
            }),
            "did:ethr": new EthrDIDProvider({
              defaultKms: "local",
              network: "mainnet",
            }),
          },
        }),
        new DIDResolverPlugin({
          resolver: new Resolver({
            ...ethrDidResolver({ infuraProjectId: "your-infura-project-id" }),
            ...webDidResolver(),
          }),
        }),
        new CredentialPlugin(),
        new CredentialIssuerLD({
          // Built-in contexts + your custom ones (if any)
          //contextMaps: [LdDefaultContexts],
          contextMaps: this.contexts,
          // Use Veramo’s wrapper — no direct digitalbazaar import needed
          suites: [new VeramoEd25519Signature2020()],
        }),
      ],
    });
  }

  private async ensureIssuerDID(): Promise<string> {
    try {
      // Try to resolve the existing DID
      const existingDID = await this.agent.didManagerGet({
        did: this.ASSET_SCHEMA_AUTHORITY_DID,
      });
      return existingDID.did;
    } catch (error) {
      // DID doesn't exist, create it
      const identifier = await this.agent.didManagerCreate({
        provider: "did:web",
        alias: "asset-schema-authority",
        options: {
          keyType: "Ed25519",
        },
      });

      this.ASSET_SCHEMA_AUTHORITY_DID = identifier.did;
      return identifier.did;
    }
  }
/*
  public async createMinimalVC() {
    const customContexts = new Map([
      ["https://www.w3.org/2018/credentials/v1", { "@context": {} }],
    ]);
    const agent = createAgent({
      plugins: [
        new KeyManager({
          store: new MemoryKeyStore(),
          kms: { local: new KeyManagementSystem(new MemoryPrivateKeyStore()) },
        }),
        new DIDManager({
          store: new MemoryDIDStore(),
          defaultProvider: "did:key",
          providers: {
            "did:key": {},
          },
        }),
        new DIDResolverPlugin({ resolver: new Resolver() }),
        new CredentialIssuerLD({
          contextMaps: [customContexts],
          suites: [new VeramoEd25519Signature2020()],
        }),
      ],
    });
    // Create a DID for issuer
    const issuer = await agent.didManagerCreate({ alias: "issuer" });

    // Minimal credential
    const vc = await agent.createVerifiableCredential({
      credential: {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        issuer: { id: issuer.did },
        type: ["VerifiableCredential"],
      },
      proofFormat: "lds", // JSON-LD signature
    });

    console.log(JSON.stringify(vc, null, 2));
  }*/

  // Implementation of the methods defined in the interface
  public async createAssetSchemaVerifiableCredential(
    assetSchema: AssetSchema,
    assetSchemaDidDocument: AssetSchemaDidDocument,
  ): Promise<AssetSchemaVerifiableCredential> {
    try {
      if (!assetSchema || !assetSchemaDidDocument) {
        throw new Error("Asset Schema and DID Document are required.");
      }

      // Ensure the issuer DID exists or create it
      //const issuerDID = await this.ensureIssuerDID();
      const issuerDID = await this.agent.didManagerCreate({ alias: "default" });
      console.log("Issuer DID created:", issuerDID.did);
      console.log("Issuer DID Document:", issuerDID);
      // Create a did:key identifier
      //const issuerDID = await this.agent.didManagerCreate({
      //  provider: "did:key",
      //});

      const credentialSubject = {
        id: assetSchemaDidDocument.id,
        name: assetSchema.name || "Asset Schema",
        version: assetSchema.version || "1.0.0",
        hash: assetSchema.hash || "TODO",
        createdBy: assetSchemaDidDocument.authentication,
        //schema: assetSchema,
      };

      /*const unsignedVC = {
        "@context": [
          "https://www.w3.org/2018/credentials/v2",
          ...(this.localContexts ? Object.values(this.localContexts) : []),
        ],
        id: assetSchemaDidDocument.id,
        type: ["VerifiableCredential", "AssetSchemaVerifiableCredential"],
        issuer: this.ASSET_SCHEMA_AUTHORITY_DID,
        validFrom: new Date().toISOString(),
        credentialSubject,
      };*/

      // Create the verifiable credential using Veramo
      console.log("Creating Verifiable Credential...");
      /*const verifiableCredential = await this.agent.createVerifiableCredential({
        credential: {
          issuer: { id: issuerDID.did },
          credentialSubject: {
            id: "did:web:example.com",
            you: "Rock",
          },
        },
        proofFormat: "jwt",
      });*/
      const verifiableCredential = await this.agent.createVerifiableCredential({
        credential: {
          //"@context": [
          //  "https://www.w3.org/2018/credentials/v1",
          //  "https://www.w3.org/2018/credentials/v2",
          //  ...(this.localContexts ? Object.values(this.localContexts) : []),
          //{
          //  AssetSchemaVerifiableCredential:
          //    "https://example.com/contexts/asset-schema#AssetSchemaVerifiableCredential",
          //  AssetSchema:
          //    "https://example.com/contexts/asset-schema#AssetSchema",
          //},
          //],
          //"@context": [
          //  "https://www.w3.org/2018/credentials/v1",
          //  "https://www.w3.org/2018/credentials/v2",
          //  "did:example:123456789abcdefghi#", // <-- your custom context
          //],
          type: ["VerifiableCredential", "AssetSchemaVerifiableCredential"],
          id: assetSchemaDidDocument.id,
          issuer: { id: issuerDID.did },
          validFrom: new Date().toISOString(),
          credentialSubject,
        },
        proofFormat: "jwt",
        //proofFormat: "lds", // Use JSON-LD signatures to support custom contexts
        //...(this.documentLoader && { documentLoader: this.documentLoader }),
      });

      console.log(
        "Verifiable Credential created:",
        JSON.stringify(verifiableCredential, null, 2),
      );

      return verifiableCredential as AssetSchemaVerifiableCredential;
    } catch (error) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.VERIFIABLE_CREDENTIAL_CREATION_ERROR,
        message: error instanceof Error ? error.message : String(error),
      };

      throw errorDetail;
    }
  }
  /*
  public async verifyAssetSchemaVerifiableCredential(
    assetSchemaVerifiableCredential: AssetSchemaVerifiableCredential,
  ): Promise<ValidationResult> {
    // Implementation logic
  }

  public async revokeAssetSchemaVerifiableCredential(
    assetSchemaVerifiableCredential: AssetSchemaVerifiableCredential,
  ): Promise<void> {
    // Implementation logic
  }

  public async createSchemaProfileVerifiableCredential(
    schemaProfile: SchemaProfile,
    schemaProfileDidDocument: SchemaProfileDidDocument,
  ): Promise<SchemaProfileVerifiableCredential> {
    // Implementation logic
  }

  public async verifySchemaProfileVerifiableCredential(
    schemaProfileVerifiableCredential: SchemaProfileVerifiableCredential,
  ): Promise<ValidationResult> {
    // Implementation logic
  }

  public async revokeSchemaProfileVerifiableCredential(
    schemaProfileVerifiableCredential: SchemaProfileVerifiableCredential,
  ): Promise<void> {
    // Implementation logic
  }

  public async createTokenIssuanceAuthorization(
    tokenIssuanceAuthorizationRequest: TokenIssuanceAuthorizationRequest,
    didDocument: DidDocument,
  ): Promise<TokenIssuanceAuthorization> {
    // Implementation logic
  }

  public async verifyTokenIssuanceAuthorization(
    tokenIssuanceAuthorizationVerifiableCredential: TokenIssuanceAuthorizationVerifiableCredential,
  ): Promise<ValidationResult> {
    // Implementation logic
  }

  public async revokeTokenIssuanceAuthorization(
    tokenIssuanceAuthorizationVerifiableCredential: TokenIssuanceAuthorizationVerifiableCredential,
  ): Promise<void> {
    // Implementation logic
  }


  public async createVerifiableCredential(
    credential: any,
    options?: any,
  ): Promise<any>;

  public async verifyVerifiableCredential(
    credential: any,
    options?: any,
  ): Promise<ValidationResult>;

  public async revokeVerifiableCredential(
    credentialId: string,
    options?: any,
  ): Promise<any>;

  public async createVerifiablePresentation(
    presentation: any,
    options?: any,
  ): Promise<any>;

  public async verifyVerifiablePresentation(
    presentation: any,
    options?: any,
  ): Promise<ValidationResult>;

  public async revokeVerifiablePresentation(
    presentationId: string,
    options?: any,
  ): Promise<any>;
  */
}
