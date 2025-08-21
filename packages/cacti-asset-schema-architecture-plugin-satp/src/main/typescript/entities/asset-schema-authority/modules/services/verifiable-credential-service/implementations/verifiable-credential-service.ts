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
import * as vc from "@digitalbazaar/vc";

import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";
import { Ed25519Signature2020 } from "@digitalbazaar/ed25519-signature-2020";
import { extendContextLoader } from "jsonld-signatures";

import { driver } from "@digitalbazaar/did-method-key";

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
import {
  createCustomLoader,
  createCustomLoaderV2,
} from "../../../../../../utils/custom-loader";
import { createVeramoDocumentLoader } from "../../../../../../utils/custom-veramo-loader";
import { IVerifiableCredentialService } from "../interfaces/verifiable-credential-service.interface";

type ConfiguredAgent = TAgent<
  IDIDManager & IKeyManager & IResolver & ICredentialPlugin
>;

export class VerifiableCredentialService
  implements IVerifiableCredentialService
{
  private localContexts: Map<string, any> | undefined;
  private documentLoader: any;
  private contexts: [Map<string, any>];
  private localContextsObj: any;
  private agent: ConfiguredAgent;
  private ASSET_SCHEMA_AUTHORITY_DID =
    "did:web:example.com:asset-schema-authority";

  constructor(localContexts?: Map<string, any>) {
    // Store provided contexts
    this.localContexts = localContexts;

    this.contexts = [LdDefaultContexts];
    this.agent = this.createAgent();
    // Create a custom loader for these contexts
    this.documentLoader = localContexts
      ? createCustomLoader(localContexts)
      : undefined;

    if (localContexts) {
      this.localContexts = localContexts;
      this.contexts = [new Map([...LdDefaultContexts, ...localContexts])];
      console.log("Using custom contexts for Veramo agent:\n", this.contexts);

      (jsonld as any).documentLoader = createCustomLoader(this.localContexts);
    } else {
      this.localContexts = LdDefaultContexts;
      (jsonld as any).documentLoader = LdDefaultContexts;
    }
  }

  public getAgent(): ConfiguredAgent {
    return this.agent;
  }

  public async vcIssueAndVerifyTest(): Promise<void> {
    console.log("Running small test...");

    const didKeyDriver = driver();
    didKeyDriver.use({
      multibaseMultikeyHeader: "z6Mk",
      fromMultibase: Ed25519VerificationKey2020.from,
    });

    // A very simple "local context" map for testing
    const testLocalContexts = new Map<string, any>([
      [
        "https://www.w3.org/2018/credentials/v1",
        {
          "@context": {
            id: "@id",
            type: "@type",
            VerifiableCredential:
              "https://www.w3.org/2018/credentials#VerifiableCredential",
            AlumniCredential: "https://example.com/AlumniCredential",
          },
        },
      ],
      [
        "https://w3id.org/security/suites/ed25519-2020/v1",
        {
          "@context": {
            "@version": 1.1,
            id: "@id",
            type: "@type",
            Ed25519VerificationKey2020:
              "https://w3id.org/security#Ed25519VerificationKey2020",
            Ed25519Signature2020:
              "https://w3id.org/security#Ed25519Signature2020",
            proof: {
              "@id": "https://w3id.org/security#proof",
              "@type": "@id",
              "@context": {
                created: "http://purl.org/dc/terms/created",
                verificationMethod: {
                  "@id": "https://w3id.org/security#verificationMethod",
                  "@type": "@id",
                },
                proofPurpose: {
                  "@id": "https://w3id.org/security#proofPurpose",
                  "@type": "@id",
                },
                jws: "https://w3id.org/security#jws",
              },
            },
          },
        },
      ],
    ]);

    // Minimal loader
    const testDocumentLoader = extendContextLoader(async (url: string) => {
      console.log(
        ">>> documentLoader raw input:",
        JSON.stringify(url, null, 2),
      );
      if (!url) {
        throw new Error("documentLoader called with undefined URL");
      }
      if (testLocalContexts.has(url)) {
        return {
          contextUrl: null,
          documentUrl: url,
          document: testLocalContexts.get(url),
          tag: "local",
        };
      }
      if (url.startsWith("did:key:")) {
        const didDoc = await didKeyDriver.get({ did: url });
        return {
          contextUrl: null,
          documentUrl: url,
          document: didDoc,
        };
      }
      // fallback to VC default loader
      return vc.defaultDocumentLoader(url);
    });

    const keyPair = await Ed25519VerificationKey2020.generate();
    const controller = `did:key:${keyPair.fingerprint()}`;
    keyPair.controller = controller;
    keyPair.id = `${controller}#${keyPair.fingerprint()}`;
    const suite = new Ed25519Signature2020({ key: keyPair });

    console.log("Generated key pair:", keyPair);
    console.log("Using suite:", suite);

    // Sample unsigned credential
    const credential = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "https://example.com/credentials/1872",
      type: ["VerifiableCredential", "AlumniCredential"],
      issuer: controller,
      issuanceDate: "2010-01-01T19:23:24Z",
      credentialSubject: {
        id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
        alumniOf: "Example University",
      },
    };
    //suite.verificationMethod = keyPair.id;
    //console.log(suite.verificationMethod);
    const signedVC = await vc.issue({
      credential,
      suite,
      documentLoader: testDocumentLoader,
    });
    console.log(JSON.stringify(signedVC, null, 2));

    const did = "did:key:z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T";
    const didDocument = await didKeyDriver.get({ did });
    console.log("The generated DID Document:\n", didDocument);

    testLocalContexts.set(did, didDocument);

    const testDocumentLoader2 = extendContextLoader(async (url: string) => {
      console.log(
        ">>> documentLoader raw input:",
        JSON.stringify(url, null, 2),
      );
      if (!url) {
        throw new Error("documentLoader called with undefined URL");
      }
      if (testLocalContexts.has(url)) {
        return {
          contextUrl: null,
          documentUrl: url,
          document: testLocalContexts.get(url),
          tag: "local",
        };
      }
      if (url.startsWith("did:key:")) {
        const didDoc = await didKeyDriver.get({ did: url });
        return {
          contextUrl: null,
          documentUrl: url,
          document: didDoc,
        };
      }
      // fallback to VC default loader
      return vc.defaultDocumentLoader(url);
    });

    const loggingLoader = async (url: string) => {
      console.log("DocumentLoader called for URL:", url);
      const doc = await testDocumentLoader2(url);
      console.log("DocumentLoader returned:", doc ? "OK" : "undefined");
      return doc;
    };
    const result = await vc.verifyCredential({
      credential: signedVC,
      suite,
      documentLoader: loggingLoader,
    });
    console.log("Verification Result:\n", JSON.stringify(result, null, 2));
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

  public async OLDcreateAssetSchemaVerifiableCredential(
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

  // Implementation of the methods defined in the interface
  public async createAssetSchemaVerifiableCredential(
    assetSchema: AssetSchema,
    assetSchemaDidDocument: AssetSchemaDidDocument,
  ): Promise<AssetSchemaVerifiableCredential> {
    try {
      if (!assetSchema || !assetSchemaDidDocument) {
        throw new Error("Asset Schema and DID Document are required.");
      }

      // Setting up the credential
      const credentialSubject = {
        id: assetSchemaDidDocument.id,
        name: assetSchema.name || "Asset Schema",
        version: assetSchema.version || "1.0.0",
        hash: assetSchema.hash || "TODO",
        createdBy: assetSchemaDidDocument.authentication,
        //schema: assetSchema,
      };

      const unsignedCredential = {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        id: assetSchemaDidDocument.id,
        type: ["VerifiableCredential", "AssetSchemaVerifiableCredential"],
        issuer: this.ASSET_SCHEMA_AUTHORITY_DID,
        issuanceDate: new Date().toISOString(),
        credentialSubject,
      };

      console.log("Unsigned Credential:\n:", unsignedCredential);

      // Cryptosuite
      const keyPair = await Ed25519VerificationKey2020.generate();
      keyPair.id = `did:key:${keyPair.fingerprint()}`;
      const suite = new Ed25519Signature2020({ key: keyPair });

      console.log("Generated key pair:\n", keyPair);
      console.log("Using suite:\n", suite);

      // Document Loader
      console.log("Local Contexts:\n", this.localContexts);

      const documentLoader = extendContextLoader(async (url: string) => {
        if (this.localContexts && this.localContexts.has(url)) {
          return {
            contextUrl: null,
            documentUrl: url,
            document: this.localContexts.get(url),
            tag: "local",
          };
        }
        // fallback to VC default loader
        return vc.defaultDocumentLoader(url);
      });

      // Create the verifiable credential
      console.log("Creating Verifiable Credential...");

      const verifiableCredential = await vc.issue({
        credential: unsignedCredential,
        suite,
        documentLoader,
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
