import { LdDefaultContexts } from "@veramo/credential-ld";

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
  SchemaProfileVerifiableCredential,
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
import {
  normalizeCredential,
  setupCryptoSuite,
  setupLoader,
  generateNonce,
  hashJsonLd,
  verifyJsonLdHash,
} from "../../../../../../utils/vc-helpers";
import { IVerifiableCredentialService } from "../interfaces/verifiable-credential-service.interface";
import {
  VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT,
  VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020,
} from "../../../../certificates/asset-schema-authority-did-document";
import { canonize } from "jsonld";

export class VerifiableCredentialService
  implements IVerifiableCredentialService
{
  private localContexts: Map<string, any> | undefined;
  private asaDidDocument: any;
  private contexts: any;
  private documentLoader: any;

  constructor(localContexts?: Map<string, any>) {
    this.asaDidDocument = VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT;
    // Store provided contexts
    this.localContexts = localContexts;

    this.contexts = [LdDefaultContexts];
    // Create a custom loader for these contexts
    this.documentLoader = localContexts
      ? createCustomLoader(localContexts)
      : undefined;

    if (localContexts) {
      this.localContexts = localContexts;
      this.contexts = [new Map([...LdDefaultContexts, ...localContexts])];
      //console.log("Using custom contexts for Veramo agent:\n", this.contexts);

      (jsonld as any).documentLoader = createCustomLoader(this.localContexts);
    } else {
      this.localContexts = LdDefaultContexts;
      (jsonld as any).documentLoader = LdDefaultContexts;
    }
  }
  /***********************************************************TEST METHODS*/
  /**
   * A simple test to exercise the issue() and verify() library methods
   */
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
    console.log("Using suite:", JSON.stringify(suite, null, 2));

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

    //############################################################ISSUE
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
    //############################################################VERIFY
    const result = await vc.verifyCredential({
      credential: signedVC,
      suite,
      documentLoader: loggingLoader,
    });
    console.log("Verification Result:\n", JSON.stringify(result, null, 2));
  }

  /***********************************************************INTERFACE METHODS*/
  /**
   * Creates the Asset Schema Verifiable Credential
   * @param assetSchema
   * @param assetSchemaDidDocument
   * @returns
   */
  public async createAssetSchemaVerifiableCredential(
    assetSchema: AssetSchema,
    assetSchemaDidDocument: AssetSchemaDidDocument,
  ): Promise<AssetSchemaVerifiableCredential> {
    try {
      console.debug("Issuing Asset Schema Verifiable Credential...\n");
      if (!assetSchema || !assetSchemaDidDocument) {
        throw new Error(
          "Missing Required Inputs: Asset Schema and DID Document are required.",
        );
      }
      if (!this.localContexts) {
        console.debug("No Local contexts. Dereferencing remote contexts...\n");
      }

      // Document Loader
      console.debug("Local Contexts:\n", this.localContexts);
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

      // Setting up the credential
      const nonce = generateNonce();
      const hash = await hashJsonLd(assetSchema, nonce, documentLoader);

      const credentialSubject = {
        id: assetSchemaDidDocument.id,
        name: assetSchema.name || "Asset Schema",
        version: assetSchema.version || "1.0.0",
        hash: hash,
        nonce: nonce,
        createdBy: assetSchemaDidDocument.authentication,
        schema: assetSchema,
      };

      const unsignedCredential = {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://www.example.org/asset-schema/vc/v1",
        ],
        id: assetSchemaDidDocument.id,
        type: ["VerifiableCredential", "AssetSchemaVerifiableCredential"],
        issuer:
          VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020.key.controller,
        issuanceDate: new Date().toISOString(),
        credentialSubject,
      };

      console.debug("Unsigned Credential:\n:", unsignedCredential);

      // Cryptosuite
      const assetSchemaAuthorityKeyPair = new Ed25519VerificationKey2020({
        id: VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020.key.id,
        controller:
          VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020.key.controller,
        publicKeyMultibase:
          VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020.key
            .publicKeyMultibase,
        privateKeyMultibase:
          VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020.key
            .privateKeyMultibase,
      });

      const suite = new Ed25519Signature2020({
        key: assetSchemaAuthorityKeyPair,
      });
      console.debug("Cryptosuite:\n", suite);

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

  /**
   * Verifies the Asset Schema Verifiable Credential
   * @param assetSchemaVerifiableCredential
   * @returns
   */
  public async verifyAssetSchemaVerifiableCredential(
    assetSchemaVerifiableCredential: AssetSchemaVerifiableCredential,
  ): Promise<ValidationResult> {
    try {
      console.debug("Verifying Verifiable Credential...\n");
      if (!assetSchemaVerifiableCredential) {
        throw new Error("Asset Schema and DID Document are required.");
      }
      if (!assetSchemaVerifiableCredential.proof) {
        throw new Error("Non-existing Proof");
      }
      if (!this.localContexts) {
        console.debug("No Local contexts. Dereferencing remote contexts...\n");
      }

      const { suite } = await setupCryptoSuite(assetSchemaVerifiableCredential);
      const { loader } = await setupLoader(this.localContexts);

      // Normalize the credential
      const normalizedVC = normalizeCredential(assetSchemaVerifiableCredential);

      if (normalizedVC.proof) {
        let fragment = normalizedVC.proof.verificationMethod;
        console.debug("fragment", fragment);
        if (!fragment.includes("#")) {
          fragment = `${fragment}#${fragment.split(":").pop()}`;
        }

        console.log("full key ID with fragment:", fragment);

        // Optionally, patch the VC proof
        normalizedVC.proof.verificationMethod = fragment;
        normalizedVC.issuer = `did:key:${normalizedVC.proof.verificationMethod
          .split("#")
          .pop()}`;
      }
      console.debug("normalizedVC:\n", normalizedVC);

      /*UNCOMMENT FOR DEBUGGING 
      const nquads = await canonize(normalizedVC, {
        algorithm: "URDNA2015",
        format: "application/n-quads",
        documentLoader: loader,
      });

      console.debug(nquads);
      /************************/

      const result = await vc.verifyCredential({
        credential: normalizedVC,
        suite,
        documentLoader: loader,
      });
      console.debug("Verification Result:\n", JSON.stringify(result, null, 2));

      if (!result.verified) {
        throw new Error("Proof verification failed");
      }

      const isValidHash = await verifyJsonLdHash(
        normalizedVC,
        normalizedVC.credentialSubject.schema,
      );
      console.log("Hash is valid:", isValidHash);

      return {
        valid: result.verified,
        details: "Asset Schema successfully verified",
      } as ValidationResult;
    } catch (error) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.PROOF_VERIFICATION_ERROR,
        message: error instanceof Error ? error.message : String(error),
      };

      throw errorDetail;
    }
  }
  /*
  public async revokeAssetSchemaVerifiableCredential(
    assetSchemaVerifiableCredential: AssetSchemaVerifiableCredential,
  ): Promise<void> {
    // Implementation logic
  }*/

  public async createSchemaProfileVerifiableCredential(
    schemaProfile: SchemaProfile,
    schemaProfileDidDocument: SchemaProfileDidDocument,
  ): Promise<SchemaProfileVerifiableCredential> {
    try {
      console.debug("Issuing Schema Profile Verifiable Credential...\n");
      if (!schemaProfile || !schemaProfileDidDocument) {
        throw new Error(
          "Missing Required Inputs: Asset Schema and DID Document are required.",
        );
      }
      if (!this.localContexts) {
        console.debug("No Local contexts. Dereferencing remote contexts...\n");
      }

      // Document Loader
      console.debug("Local Contexts:\n", this.localContexts);
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

      // Setting up the credential
      const nonce = generateNonce();
      const hash = await hashJsonLd(schemaProfile, nonce, documentLoader);

      const credentialSubject = {
        id: schemaProfileDidDocument.id,
        name: schemaProfile.name || "Schema Profile",
        version: schemaProfile.version || "1.0.0",
        hash: hash,
        nonce: nonce,
        createdBy: schemaProfileDidDocument.authentication,
        schema: schemaProfile,
        assetSchema: "did:example:123456789abcdefghi#",
      };

      const unsignedCredential = {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://www.example.org/schema-profile/vc/v1",
          "did:example:123456789abcdefghi#",
        ],
        id: schemaProfileDidDocument.id,
        type: ["VerifiableCredential", "SchemaProfileVerifiableCredential"],
        issuer:
          VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020.key.controller,
        issuanceDate: new Date().toISOString(),
        credentialSubject,
      };

      console.debug("Unsigned Credential:\n:", unsignedCredential);

      // Cryptosuite
      const assetSchemaAuthorityKeyPair = new Ed25519VerificationKey2020({
        id: VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020.key.id,
        controller:
          VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020.key.controller,
        publicKeyMultibase:
          VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020.key
            .publicKeyMultibase,
        privateKeyMultibase:
          VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020.key
            .privateKeyMultibase,
      });

      const suite = new Ed25519Signature2020({
        key: assetSchemaAuthorityKeyPair,
      });
      console.debug("Cryptosuite:\n", suite);

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

      return verifiableCredential as SchemaProfileVerifiableCredential;
    } catch (error) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.VERIFIABLE_CREDENTIAL_CREATION_ERROR,
        message: error instanceof Error ? error.message : String(error),
      };

      throw errorDetail;
    }
  }

  public async verifySchemaProfileVerifiableCredential(
    schemaProfileVerifiableCredential: SchemaProfileVerifiableCredential,
  ): Promise<ValidationResult> {
    try {
      console.debug("Verifying Verifiable Credential...\n");
      if (!schemaProfileVerifiableCredential) {
        throw new Error("Schema Profile and DID Document are required.");
      }
      if (!schemaProfileVerifiableCredential.proof) {
        throw new Error("Non-existing Proof");
      }
      if (!this.localContexts) {
        console.debug("No Local contexts. Dereferencing remote contexts...\n");
      }

      const { suite } = await setupCryptoSuite(
        schemaProfileVerifiableCredential,
      );
      const { loader } = await setupLoader(this.localContexts);

      // Normalize the credential
      const normalizedVC = normalizeCredential(
        schemaProfileVerifiableCredential,
      );

      if (normalizedVC.proof) {
        let fragment = normalizedVC.proof.verificationMethod;
        console.debug("fragment", fragment);
        if (!fragment.includes("#")) {
          fragment = `${fragment}#${fragment.split(":").pop()}`;
        }

        console.log("full key ID with fragment:", fragment);

        // Optionally, patch the VC proof
        normalizedVC.proof.verificationMethod = fragment;
        normalizedVC.issuer = `did:key:${normalizedVC.proof.verificationMethod
          .split("#")
          .pop()}`;
      }
      console.debug("normalizedVC:\n", normalizedVC);

      const result = await vc.verifyCredential({
        credential: normalizedVC,
        suite,
        documentLoader: loader,
      });
      console.debug("Verification Result:\n", JSON.stringify(result, null, 2));

      if (!result.verified) {
        throw new Error("Proof verification failed");
      }

      const isValidHash = await verifyJsonLdHash(
        normalizedVC,
        normalizedVC.credentialSubject.schema,
        loader,
      );
      console.log("Hash is valid:", isValidHash);

      return {
        valid: result.verified,
        details: "Schema Profile successfully verified",
      } as ValidationResult;
    } catch (error) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.PROOF_VERIFICATION_ERROR,
        message: error instanceof Error ? error.message : String(error),
      };

      throw errorDetail;
    }
  }

  /*
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
