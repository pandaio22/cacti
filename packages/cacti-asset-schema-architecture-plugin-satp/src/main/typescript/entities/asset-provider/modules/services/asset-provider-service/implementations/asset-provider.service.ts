import {
  TokenIssuanceAuthorizationRequest,
  TokenIssuanceAuthorization,
  SchemaProfileDidDocument,
  TokenizedAssetRecord,
  TokenizedAssetRecordVerifiableCredential,
  TokenizedAssetRecordDidDocument,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";

import { LdDefaultContexts } from "@veramo/credential-ld";
import jsonld from "jsonld";

import * as vc from "@digitalbazaar/vc";
import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";
import { Ed25519Signature2020 } from "@digitalbazaar/ed25519-signature-2020";
import { extendContextLoader } from "jsonld-signatures";

import { driver } from "@digitalbazaar/did-method-key";
import {
  ValidationErrorDetail,
  ValidationErrorType,
  ValidationResult,
} from "../../../../../../types/asset-schema-architecture-types.type";
import { createCustomLoader } from "../../../../../../utils/custom-loader";
import {
  normalizeCredential,
  setupCryptoSuite,
  setupLoader,
  generateNonce,
  hashJsonLd,
  verifyJsonLdHash,
} from "../../../../../../utils/vc-helpers";
import {
  VALID_ASSET_PROVIDER_DID_DOCUMENT,
  VALID_ASSET_PROVIDER_ED25519SIGNATURE2020,
} from "../../../../certificates/asset-provider-did-document";

import { IAssetProviderService } from "../interfaces/asset-provider-service.interface";

export class AssetProviderService implements IAssetProviderService {
  private localContexts: Record<string, any> | undefined;
  private documentLoader: any;

  constructor(localContexts?: Record<string, any>) {
    // Store provided contexts
    this.localContexts = localContexts;

    // Create a custom loader for these contexts
    this.documentLoader = this.localContexts
      ? createCustomLoader(this.localContexts)
      : undefined;

    if (localContexts) {
      this.localContexts = localContexts;
      (jsonld as any).documentLoader = createCustomLoader(this.localContexts);
    } else {
      this.localContexts = LdDefaultContexts;
      (jsonld as any).documentLoader = LdDefaultContexts;
    }
  }

  /***********************************************************INTERFACE METHODS*/
  public async createTokenIssuanceAuthorizationRequest(
    networkId: string,
    schemaProfileDidDocument: SchemaProfileDidDocument,
  ): Promise<TokenIssuanceAuthorizationRequest> {
    try {
      console.debug("Issuing Asset Schema Verifiable Credential...\n");
      if (!networkId || !schemaProfileDidDocument) {
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
        if (this.localContexts && this.localContexts[url]) {
          return {
            contextUrl: null,
            documentUrl: url,
            document: this.localContexts[url],
            tag: "local",
          };
        }
        // fallback to VC default loader
        return vc.defaultDocumentLoader(url);
      });

      // Setting up the credential
      const nonce = generateNonce();
      const hash = await hashJsonLd(
        schemaProfileDidDocument,
        nonce,
        documentLoader,
      );

      const credentialSubject = {
        id: schemaProfileDidDocument.id,
        assetProvider: {
          name: VALID_ASSET_PROVIDER_DID_DOCUMENT.name,
          id: VALID_ASSET_PROVIDER_DID_DOCUMENT.id,
          organizationKey: {
            publicKey:
              VALID_ASSET_PROVIDER_DID_DOCUMENT.verificationMethod[0]
                .publicKeyMultibase,
            type: VALID_ASSET_PROVIDER_DID_DOCUMENT.verificationMethod[0].type,
          },
        },
        networkId: networkId,
        name: "Token Issuance Authorization Request",
        version: "1.0.0",
        hash: hash,
        nonce: nonce,
        createdBy: VALID_ASSET_PROVIDER_DID_DOCUMENT.id,
        schema: { id: schemaProfileDidDocument.id },
      };

      const unsignedCredential = {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://www.example.org/schema-profile/vc/v1",
          "https://www.w3.org/ns/did/v1",
        ],
        id:
          "https://www.example.org/token-issuance-authorization-request/" +
          hash,
        type: ["VerifiableCredential", "TokenIssuanceAuthorizationRequest"],
        issuer: VALID_ASSET_PROVIDER_ED25519SIGNATURE2020.key.controller,
        issuanceDate: new Date().toISOString(),
        credentialSubject,
      };

      console.debug("Unsigned Credential:\n:", unsignedCredential);

      // Cryptosuite
      const assetProviderKeyPair = new Ed25519VerificationKey2020({
        id: VALID_ASSET_PROVIDER_ED25519SIGNATURE2020.key.id,
        controller: VALID_ASSET_PROVIDER_ED25519SIGNATURE2020.key.controller,
        publicKeyMultibase:
          VALID_ASSET_PROVIDER_ED25519SIGNATURE2020.key.publicKeyMultibase,
        privateKeyMultibase:
          VALID_ASSET_PROVIDER_ED25519SIGNATURE2020.key.privateKeyMultibase,
      });

      const suite = new Ed25519Signature2020({
        key: assetProviderKeyPair,
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

      return verifiableCredential as TokenIssuanceAuthorizationRequest;
    } catch (error) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.VERIFIABLE_CREDENTIAL_CREATION_ERROR,
        message: error instanceof Error ? error.message : String(error),
      };

      throw errorDetail;
    }
  }

  public async verifyTokenIssuanceAuthorizationRequest(
    tokenIssuanceAuthorizationRequest: TokenIssuanceAuthorizationRequest,
  ): Promise<ValidationResult> {
    try {
      console.debug("Verifying Verifiable Credential...\n");
      if (!tokenIssuanceAuthorizationRequest) {
        throw new Error("Token Issuance Authorization Request is required.");
      }
      if (!tokenIssuanceAuthorizationRequest.proof) {
        throw new Error("Non-existing Proof");
      }
      if (!this.localContexts) {
        console.debug("No Local contexts. Dereferencing remote contexts...\n");
      }

      const { suite } = await setupCryptoSuite(
        tokenIssuanceAuthorizationRequest,
      );
      const { loader } = await setupLoader(this.localContexts);

      // Normalize the credential
      const normalizedVC = normalizeCredential(
        tokenIssuanceAuthorizationRequest,
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
        this.documentLoader,
      );
      console.log("Hash is valid:", isValidHash);

      return {
        valid: result.verified,
        details: "Token Issuance Authorization Request successfully verified",
      } as ValidationResult;
    } catch (error) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.PROOF_VERIFICATION_ERROR,
        message: error instanceof Error ? error.message : String(error),
      };

      throw errorDetail;
    }
  }

  public async createTokenizedAssetRecord(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<{
    tokenizedAssetRecord: TokenizedAssetRecord;
    tokenizedAssetRecordVerifiableCredential: TokenizedAssetRecordVerifiableCredential;
    tokenizedAssetRecordDidDocument: TokenizedAssetRecordDidDocument;
  }> {
    try {
      //Step 1: Validate Input
      console.debug("Issuing Asset Schema Verifiable Credential...\n");
      if (!tokenIssuanceAuthorization) {
        throw new Error(
          "Missing Required Inputs: Token Issuance Authorization is required.",
        );
      }
      if (!this.localContexts) {
        console.debug("No Local contexts. Dereferencing remote contexts...\n");
      }

      //Step 2: Create Tokenized Asset Record - USE CASE EXAMPLE
      console.debug("Digitized Asset Record created...\n");
      const tokenizedAssetRecord: TokenizedAssetRecord = {
        "@context": [{ "@version": 1.1 }, "did:example:56745689abcdefghi#"],
        schema_profile: "did:example:56745689abcdefghi#schema-profile",
        token_issuance_authorization: tokenIssuanceAuthorization,
        dcap: {
          rwa: {
            digital_carrier_id: "E492069BT491278256346325",
            digital_carrier_type: "rfid_tag",
            rwa_kind: {
              en: "Various cases",
            },
            rwa_description: {
              en: "Blue velvet jewelry box with fabric lining on the inside. The metal edges in gold colour can be seen at the application point of the hinged cover.",
            },
            rwa_current_storage: {
              en: "Former Royal Estate",
            },
            rwa_storage_location: {
              en: "Former Royal Estate, Box XX",
            },
          },
          dcar: {
            dar_id: "911024",
            dar_system_id: "5TDYIU",
            dar_url: "https://www.culture.example.org/doi/5TDYIU/911024",
            dar_description: {
              en: " Blue velvet jewelry box with fabric lining inside.",
            },
          },
        },
      };

      //Step 3: Create Tokenized Asset Record DID Document - USE CASE EXAMPLE
      const tokenizedAssetRecordDidDocument: TokenizedAssetRecordDidDocument = {
        "@context": "https://www.w3.org/ns/did/v1",
        id: "did:example:tar:123456789abcdef",
        controller: "did:example:provider:abcdef123456",
        verificationMethod: [
          {
            id: "did:example:asset:123456789abcdef#key-1",
            type: "Ed25519VerificationKey2020",
            controller: "did:example:asset:123456789abcdef",
            publicKeyMultibase: "z6Mkj…",
          },
        ],
        authentication: ["did:example:tar:123456789abcdef"],
        assertionMethod: ["did:example:tar:123456789abcdef"],
      };

      //Step 4: Create Tokenized Asset Record Verifiable Credential

      // Document Loader
      console.debug("Local Contexts:\n", this.localContexts);
      const documentLoader = extendContextLoader(async (url: string) => {
        if (this.localContexts && this.localContexts[url]) {
          return {
            contextUrl: null,
            documentUrl: url,
            document: this.localContexts[url],
            tag: "local",
          };
        }
        // fallback to VC default loader
        return vc.defaultDocumentLoader(url);
      });

      // Setting up the credential
      const nonce = generateNonce();
      const hash = await hashJsonLd(
        tokenizedAssetRecord,
        nonce,
        documentLoader,
      );

      const credentialSubject = {
        id: tokenizedAssetRecordDidDocument.id,
        name: "Tokenized Asset Record Example",
        version: "1.0.0",
        hash: hash,
        nonce: nonce,
        createdBy: VALID_ASSET_PROVIDER_DID_DOCUMENT.id,
        schemaProfile:
          tokenIssuanceAuthorization.credentialSubject
            ?.tokenIssuanceAuthorizationRequest?.credentialSubject
            .schemaProfile,
        tokenIssuanceAuthorization: tokenIssuanceAuthorization,
        tokenizedAssetRecord: tokenizedAssetRecord,
      };

      const unsignedCredential = {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://www.example.org/schema-profile/vc/v1",
          "https://www.w3.org/ns/did/v1",
        ],
        id: tokenizedAssetRecordDidDocument.id,
        type: [
          "VerifiableCredential",
          "TokenizedAssetRecordVerifiableCredential",
        ],
        issuer: VALID_ASSET_PROVIDER_ED25519SIGNATURE2020.key.controller,
        issuanceDate: new Date().toISOString(),
        credentialSubject,
      };

      console.debug("Unsigned Credential:\n:", unsignedCredential);

      // Cryptosuite
      const assetProviderKeyPair = new Ed25519VerificationKey2020({
        id: VALID_ASSET_PROVIDER_ED25519SIGNATURE2020.key.id,
        controller: VALID_ASSET_PROVIDER_ED25519SIGNATURE2020.key.controller,
        publicKeyMultibase:
          VALID_ASSET_PROVIDER_ED25519SIGNATURE2020.key.publicKeyMultibase,
        privateKeyMultibase:
          VALID_ASSET_PROVIDER_ED25519SIGNATURE2020.key.privateKeyMultibase,
      });

      const suite = new Ed25519Signature2020({
        key: assetProviderKeyPair,
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

      //Step 5: Return results, or throw error
      return {
        tokenizedAssetRecord: tokenizedAssetRecord,
        tokenizedAssetRecordVerifiableCredential:
          verifiableCredential as TokenizedAssetRecordVerifiableCredential,
        tokenizedAssetRecordDidDocument: tokenizedAssetRecordDidDocument,
      };
    } catch (error) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.CREATE_TOKENIZED_ASSET_RECORD_ERROR,
        message: error instanceof Error ? error.message : String(error),
      };

      throw errorDetail;
    }
  }

  public async verifyTokenizedAssetRecord(
    tokenizedAssetRecordVerifiableCredential: TokenizedAssetRecordVerifiableCredential,
  ): Promise<ValidationResult> {
    try {
      console.debug("Verifying Verifiable Credential...\n");
      if (!tokenizedAssetRecordVerifiableCredential) {
        throw new Error("Token Issuance Authorization Request is required.");
      }
      if (!tokenizedAssetRecordVerifiableCredential.proof) {
        throw new Error("Non-existing Proof");
      }
      if (!this.localContexts) {
        console.debug("No Local contexts. Dereferencing remote contexts...\n");
      }

      const { suite } = await setupCryptoSuite(
        tokenizedAssetRecordVerifiableCredential,
      );
      const { loader } = await setupLoader(this.localContexts);

      // Normalize the credential
      const normalizedVC = normalizeCredential(
        tokenizedAssetRecordVerifiableCredential,
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
        normalizedVC.credentialSubject.tokenizedAssetRecord,
      );
      console.log("Hash is valid:", isValidHash);

      return {
        valid: result.verified,
        details: "Token Issuance Authorization Request successfully verified",
      } as ValidationResult;
    } catch (error) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.PROOF_VERIFICATION_ERROR,
        message: error instanceof Error ? error.message : String(error),
      };

      throw errorDetail;
    }
  }
}
