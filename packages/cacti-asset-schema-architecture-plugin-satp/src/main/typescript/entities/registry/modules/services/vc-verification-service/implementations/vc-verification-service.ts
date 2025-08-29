import jsonld from "jsonld";
import * as vc from "@digitalbazaar/vc";
import {
  AssetSchemaVerifiableCredential,
  SchemaProfileVerifiableCredential,
  TokenIssuanceAuthorization,
  TokenizedAssetRecordVerifiableCredential,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";
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
  verifyJsonLdHash,
} from "../../../../../../utils/vc-helpers";
import { IVcVerificationService } from "../interfaces/vc-verification-service.interface";

export class VcVerificationService implements IVcVerificationService {
  private localContexts: Record<string, any> | undefined;
  private documentLoader: any;

  constructor(localContexts?: Record<string, any>) {
    this.localContexts = localContexts;
    this.documentLoader = localContexts
      ? createCustomLoader(localContexts)
      : undefined;

    if (this.localContexts) {
      (jsonld as any).documentLoader = createCustomLoader(this.localContexts);
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
        throw new Error("Asset Schema VC is required.");
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

  /**
   * Verifies the Schema Profile Verifiable Credential
   * @param schemaProfileVerifiableCredential
   * @returns
   */
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

  /**
   * Verifies the TokenIssuanceAuthorization
   * @param tokenIssuanceAuthorizationRequest
   * @param didDocument
   * @returns TokenIssuanceAuthorization
   * @ensures TokenIssuanceAuthorization contains the Asset Provider public key
   * @ensures TokenIssuanceAuthorization is signed by the Asset Schema Authority
   */
  public async verifyTokenIssuanceAuthorization(
    tokenIssuanceAuthorizationVerifiableCredential: TokenIssuanceAuthorization,
  ): Promise<ValidationResult> {
    try {
      console.debug("Verifying Token Issuance Authorization...\n");
      if (!tokenIssuanceAuthorizationVerifiableCredential) {
        throw new Error("Token Issuance Authorization is required.");
      }
      if (!tokenIssuanceAuthorizationVerifiableCredential.proof) {
        throw new Error("Non-existing Proof");
      }
      if (!this.localContexts) {
        console.debug("No Local contexts. Dereferencing remote contexts...\n");
      }

      const { suite } = await setupCryptoSuite(
        tokenIssuanceAuthorizationVerifiableCredential,
      );
      const { loader } = await setupLoader(this.localContexts);

      // Normalize the credential
      const normalizedVC = normalizeCredential(
        tokenIssuanceAuthorizationVerifiableCredential,
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
        normalizedVC.credentialSubject.tokenIssuanceAuthorizationRequest,
        loader,
      );
      console.log("Hash is valid:", isValidHash);

      return {
        valid: result.verified,
        details: "Token Issuance Authorization successfully verified",
      } as ValidationResult;
    } catch (error) {
      const errorDetail: ValidationErrorDetail = {
        type: ValidationErrorType.PROOF_VERIFICATION_ERROR,
        message: error instanceof Error ? error.message : String(error),
      };

      throw errorDetail;
    }
  }

  /**
   * Verifies a Tokenized Asset Record Verifiable Credential.
   * @param tokenIssuanceAuthorizationVerifiableCredential The Verifiable Credential to verify.
   * @returns A promise that resolves to a ValidationResult indicating the validity of the Tokenized Asset Record.
   */
  public async verifyTokenizedAssetRecordVerifiableCredential(
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
