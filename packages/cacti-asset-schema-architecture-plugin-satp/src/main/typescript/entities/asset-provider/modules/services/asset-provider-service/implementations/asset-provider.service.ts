import {
  TokenIssuanceAuthorizationRequest,
  TokenIssuanceAuthorization,
  SchemaProfileDidDocument,
  TokenizedAssetRecord,
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
  private localContexts: Map<string, any> | undefined;
  private documentLoader: any;

  constructor(localContexts?: Map<string, any>) {
    // Store provided contexts
    this.localContexts = localContexts;

    // Create a custom loader for these contexts
    this.documentLoader = localContexts
      ? createCustomLoader(localContexts)
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
  /*
  public async createTokenizedAssetRecord(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<TokenizedAssetRecord> {
    //Placeholder
  }*/
}
