import {
  AssetSchema,
  AssetSchemaDidDocument,
  AssetSchemaVerifiableCredential,
  CommissionedAssetSchemaID,
  SchemaProfile,
  SchemaProfileDidDocument,
  SchemaProfileVerifiableCredential,
  CommissionedSchemaProfileID,
  TokenizedAssetRecord,
  TokenizedAssetRecordDidDocument,
  TokenizedAssetRecordVerifiableCredential,
  CommissionedTokenizedAssetRecordID,
  AssetSchemaAuthorityCertificate,
  AssetProviderCertificate,
  TokenIssuanceAuthorization,
  TokenIssuanceAuthorizationID,
  RegisteredAssetSchemaAuthorityID,
  RegisteredAssetProviderID,
} from "../../../../../../generated/asset-schema-architecture/typescript-axios/api";

import { RegisteredAssetSchemaDao } from "../../../dao/dao-asset-schema";
import { RegisteredSchemaProfileDao } from "../../../dao/dao-schema-profile";
import { RegisteredTokenizedAssetRecordDao } from "../../../dao/dao-tokenized-asset-record";
import { AssetSchemaAuthorityCertificateDao } from "../../../dao/dao-asset-schema-authority";
import { AssetProviderCertificateDao } from "../../../dao/dao-asset-provider";
import { TokenIssuanceAuthorizationDao } from "../../../dao/dao-token-issuance-authorization";

import { DidResolverService } from "../../did-resolver-service/implementations/did-resolver-service";
import { ValidationService } from "../../validation-service/implementations/validation-service";
import { VcVerificationService } from "../../vc-verification-service/implementations/vc-verification-service";
import { IRegistryService } from "../interfaces/registry-service.interface";

import { DEFAULT_LOCAL_CONTEXTS } from "../../../../../../utils/defaultLocalContexts";

/**
 * Registry Service for managing Asset Schemas, Schema Profiles, and Tokenized Asset Records
 */
export class RegistryService implements IRegistryService {
  private validationService: ValidationService;
  private verifiableCredentialService: VcVerificationService;
  constructor(
    private assetSchemaDao: RegisteredAssetSchemaDao = new RegisteredAssetSchemaDao(),
    private schemaProfileDao: RegisteredSchemaProfileDao = new RegisteredSchemaProfileDao(),
    private tokenizedAssetRecordDao: RegisteredTokenizedAssetRecordDao = new RegisteredTokenizedAssetRecordDao(),
    private assetSchemaAuthorityDao: AssetSchemaAuthorityCertificateDao = new AssetSchemaAuthorityCertificateDao(),
    private assetProviderDao: AssetProviderCertificateDao = new AssetProviderCertificateDao(),
    private tokenIssuanceAuthorizationDao: TokenIssuanceAuthorizationDao = new TokenIssuanceAuthorizationDao(),
    private didResolver: DidResolverService = new DidResolverService(
      new RegisteredAssetSchemaDao(),
      new RegisteredSchemaProfileDao(),
      new RegisteredTokenizedAssetRecordDao(),
    ),
    private localContexts?: Record<string, any> | undefined,
  ) {
    this.localContexts = localContexts ?? DEFAULT_LOCAL_CONTEXTS;
    this.didResolver = new DidResolverService(
      this.assetSchemaDao,
      this.schemaProfileDao,
      this.tokenizedAssetRecordDao,
    );
    this.validationService = new ValidationService(this.localContexts);
    this.verifiableCredentialService = new VcVerificationService(
      this.localContexts,
    );
  }

  /**
   * Fetch an Asset Schema by DID
   */
  public async getAssetSchema(did: string): Promise<{
    assetSchema: AssetSchema;
    assetSchemaDidDocument: AssetSchemaDidDocument;
    assetSchemaVerifiableCredential: AssetSchemaVerifiableCredential;
  }> {
    const assetSchema = await this.didResolver.resolve(did, { type: "all" });

    if (!assetSchema) {
      throw new Error(`Asset Schema with DID ${did} not found`);
    }

    return {
      assetSchema: assetSchema.assetSchema,
      assetSchemaDidDocument: assetSchema.assetSchemaDidDocument,
      assetSchemaVerifiableCredential:
        assetSchema.assetSchemaVerifiableCredential,
    };
  }

  /**
   * Retrieves a Schema Profile and its associated artifacts by unique identifier.
   */
  public async getSchemaProfile(did: string): Promise<{
    schemaProfile: SchemaProfile;
    schemaProfileDidDocument: SchemaProfileDidDocument;
    schemaProfileVerifiableCredential: SchemaProfileVerifiableCredential;
  }> {
    const schemaProfile = await this.didResolver.resolve(did, { type: "all" });
    if (!schemaProfile) {
      throw new Error(`Schema Profile with DID ${did} not found`);
    }

    return {
      schemaProfile: schemaProfile.schemaProfile,
      schemaProfileDidDocument: schemaProfile.schemaProfileDidDocument,
      schemaProfileVerifiableCredential:
        schemaProfile.schemaProfileVerifiableCredential,
    };
  }

  /**
   * Retrieves a Tokenized Asset Record by unique identifier.
   */
  public async getTokenizedAssetRecord(did: string): Promise<{
    tokenizedAssetRecord: TokenizedAssetRecord;
    tokenizedAssetRecordDidDocument: TokenizedAssetRecordDidDocument;
    tokenizedAssetRecordVerifiableCredential: TokenizedAssetRecordVerifiableCredential;
  }> {
    const tokenizedAssetRecord = await this.didResolver.resolve(did, {
      type: "all",
    });
    if (!tokenizedAssetRecord) {
      throw new Error(`Tokenized Asset Record with DID ${did} not found`);
    }

    return {
      tokenizedAssetRecord: tokenizedAssetRecord.tokenizedAssetRecord,
      tokenizedAssetRecordDidDocument:
        tokenizedAssetRecord.tokenizedAssetRecordDidDocument,
      tokenizedAssetRecordVerifiableCredential:
        tokenizedAssetRecord.tokenizedAssetRecordVerifiableCredential,
    };
  }
  /**
   * Retrieves a registered Asset Schema Authority by unique identifier.
   *
   * @param did - Unique identifier of the Asset Schema Authority.
   * @returns Promise containing the Asset Schema Authority Certificate.
   */
  public async getAssetSchemaAuthority(
    did: string,
  ): Promise<AssetSchemaAuthorityCertificate> {
    const assetSchemaAuthorityCertificate =
      await this.assetSchemaAuthorityDao.getByDid(did);
    if (!assetSchemaAuthorityCertificate) {
      throw new Error(`Asset Schema Authority with DID ${did} not found`);
    }

    return assetSchemaAuthorityCertificate.assetSchemaAuthorityCertificate as AssetSchemaAuthorityCertificate;
  }

  /**
   * Retrieves a registered Asset Provider by unique identifier.
   *
   * @param did - Unique identifier of the Asset Provider.
   * @returns Promise containing the Asset Provider Certificate.
   */
  public async getAssetProvider(
    did: string,
  ): Promise<AssetProviderCertificate> {
    const assetProviderCertificate = await this.assetProviderDao.getByDid(did);
    if (!assetProviderCertificate) {
      throw new Error(`Asset Provider with DID ${did} not found`);
    }

    return assetProviderCertificate.assetProviderCertificate as AssetProviderCertificate;
  }

  /**
   * Registers an asset schema in the database
   */
  public async commissionAssetSchema(
    assetSchema: AssetSchema,
    assetSchemaDidDocument: AssetSchemaDidDocument,
    assetSchemaVerifiableCredential: AssetSchemaVerifiableCredential,
  ): Promise<CommissionedAssetSchemaID> {
    const did = assetSchemaDidDocument.id;

    // 1️⃣ Validate input
    if (
      !did ||
      !assetSchema ||
      !assetSchemaDidDocument ||
      !assetSchemaVerifiableCredential
    ) {
      throw new Error("Missing required inputs for registering Asset Schema");
    }

    if (
      !(await this.validationService.validateAssetSchema(assetSchema)).valid
    ) {
      throw new Error("Invalid Input: Asset Schema is invalid.");
    }

    if (
      !(
        await this.validationService.validateDidDocument(assetSchemaDidDocument)
      ).valid
    ) {
      throw new Error("Invalid Input: Asset Schema DID Document is invalid.");
    }

    if (
      !this.verifiableCredentialService.verifyAssetSchemaVerifiableCredential(
        assetSchemaVerifiableCredential,
      )
    ) {
      throw new Error(
        "Invalid Verifiable Credential: Error when verifying Verifiable Credential.",
      );
    }
    // 2️⃣ Optionally: check if the DID already exists
    /*const didResolver: DidResolverService = new DidResolverService(
      this.assetSchemaDao,
      {} as any,
      {} as any,
    );
    const existing = await didResolver.resolve(did, { type: "all" });
    if (existing) {
      throw new Error(`Asset Schema with DID ${did} already exists`);
    }*/

    // 3️⃣ Persist using the DAO
    await this.assetSchemaDao.create({
      did,
      assetSchema,
      assetSchemaDidDocument,
      assetSchemaVerifiableCredential,
    });

    console.log(`Asset Schema registered with DID ${did}`);

    return {
      "@context": "https://www.w3.org/ns/did/v1.1",
      id: did,
      type: "CommissionedAssetSchemaID",
    } as CommissionedAssetSchemaID;
  }

  /**
   * Commissions (registers) a new Schema Profile in the registry.
   */
  public async commissionSchemaProfile(
    schemaProfile: SchemaProfile,
    schemaProfileDidDocument: SchemaProfileDidDocument,
    schemaProfileVerifiableCredential: SchemaProfileVerifiableCredential,
  ): Promise<CommissionedSchemaProfileID> {
    const did = schemaProfileDidDocument.id;

    if (
      !did ||
      !schemaProfile ||
      !schemaProfileDidDocument ||
      !schemaProfileVerifiableCredential
    ) {
      throw new Error("Missing required inputs for registering Schema Profile");
    }

    if (
      !(await this.validationService.validateSchemaProfile(schemaProfile)).valid
    ) {
      throw new Error("Invalid Input: Schema Profile is invalid.");
    }
    if (
      !(
        await this.validationService.validateDidDocument(
          schemaProfileDidDocument,
        )
      ).valid
    ) {
      throw new Error("Invalid Input: Schema Profile DID Document is invalid.");
    }

    if (
      !this.verifiableCredentialService.verifySchemaProfileVerifiableCredential(
        schemaProfileVerifiableCredential,
      )
    ) {
      throw new Error(
        "Invalid Verifiable Credential: Error when verifying Verifiable Credential.",
      );
    }

    await this.schemaProfileDao.create({
      did,
      schemaProfile,
      schemaProfileDidDocument,
      schemaProfileVerifiableCredential,
    });

    console.log(`Schema Profile registered with DID ${did}`);
    return {
      "@context": "https://www.w3.org/ns/did/v1.1",
      id: did,
      type: "CommissionedSchemaProfileID",
    } as CommissionedSchemaProfileID;
  }

  /**
   * Commissions (registers) a new Tokenized Asset Record in the registry.
   */
  public async commissionTokenizedAssetRecord(
    tokenizedAssetRecord: TokenizedAssetRecord,
    tokenizedAssetRecordDidDocument: TokenizedAssetRecordDidDocument,
    tokenizedAssetRecordVerifiableCredential: TokenizedAssetRecordVerifiableCredential,
  ): Promise<CommissionedTokenizedAssetRecordID> {
    const did = tokenizedAssetRecordDidDocument.id;

    if (
      !did ||
      !tokenizedAssetRecord ||
      !tokenizedAssetRecordDidDocument ||
      !tokenizedAssetRecordVerifiableCredential
    ) {
      throw new Error(
        "Missing required inputs for registering Tokenized Asset Record",
      );
    }

    if (
      !(
        await this.validationService.validateTokenizedAssetRecord(
          tokenizedAssetRecord,
        )
      ).valid
    ) {
      throw new Error("Invalid Input: Tokenized Asset Record is invalid.");
    }
    if (
      !(
        await this.validationService.validateDidDocument(
          tokenizedAssetRecordDidDocument,
        )
      ).valid
    ) {
      throw new Error(
        "Invalid Input: Tokenized Asset Record DID Document is invalid.",
      );
    }

    if (
      !this.verifiableCredentialService.verifyTokenizedAssetRecordVerifiableCredential(
        tokenizedAssetRecordVerifiableCredential,
      )
    ) {
      throw new Error(
        "Invalid Verifiable Credential: Error when verifying Verifiable Credential.",
      );
    }

    await this.tokenizedAssetRecordDao.create({
      did,
      tokenizedAssetRecord,
      tokenizedAssetRecordDidDocument,
      tokenizedAssetRecordVerifiableCredential,
    });

    console.log(`Tokenized Asset Record registered with DID ${did}`);
    return {
      "@context": "https://www.w3.org/ns/did/v1.1",
      id: did,
      type: "CommissionedTokenizedAssetRecordID",
    } as CommissionedTokenizedAssetRecordID;
  }
  /**
   * Registers a Token Issuance Authorization in the registry.
   *
   * @param tokenIssuanceAuthorization - Authorization document for token issuance.
   * @returns Promise resolving to the Token Issuance Authorization ID.
   */
  public async registerTokenIssuanceAuthorization(
    tokenIssuanceAuthorization: TokenIssuanceAuthorization,
  ): Promise<TokenIssuanceAuthorizationID> {
    if (!tokenIssuanceAuthorization) {
      throw new Error(
        "Missing required inputs for registering the Token Issuance Authorization",
      );
    }

    if (
      !(
        await this.validationService.validateTokenIssuanceAuthorization(
          tokenIssuanceAuthorization,
        )
      ).valid
    ) {
      throw new Error(
        "Invalid Input: Token Issuance Authorization Request is invalid.",
      );
    }

    if (
      !this.verifiableCredentialService.verifyTokenIssuanceAuthorization(
        tokenIssuanceAuthorization,
      )
    ) {
      throw new Error(
        "Invalid Verifiable Credential: Error when verifying Verifiable Credential.",
      );
    }
    if (tokenIssuanceAuthorization.id) {
      const id: string = tokenIssuanceAuthorization.id;
      await this.tokenIssuanceAuthorizationDao.create({
        id,
        tokenIssuanceAuthorization,
      });
    } else {
      throw new Error("Token Issuance Authorization must have an ID");
    }

    console.log(
      `Token Issuance Authorization registered with ID ${tokenIssuanceAuthorization.id}`,
    );
    return {
      "@context": "https://www.w3.org/ns/did/v1.1",
      id: tokenIssuanceAuthorization.id,
      type: "CommissionedTokenIssuanceAuthorizationID",
    } as TokenIssuanceAuthorizationID;
  }

  /**
   * Registers an Asset Schema Authority in the registry.
   *
   * @param assetSchemaAuthorityCertificate - Certificate proving the authority of the schema issuer.
   * @returns Promise resolving to the registered Asset Schema Authority ID.
   */
  public async registerAssetSchemaAuthority(
    assetSchemaAuthorityCertificate: AssetSchemaAuthorityCertificate,
  ): Promise<RegisteredAssetSchemaAuthorityID> {
    if (!assetSchemaAuthorityCertificate) {
      throw new Error(
        "Missing required inputs for registering the Asset Schema Authority",
      );
    }

    if (
      !(
        await this.validationService.validateAssetSchemaAuthorityCertificate(
          assetSchemaAuthorityCertificate,
        )
      ).valid
    ) {
      throw new Error(
        "Invalid Input: Asset Schema Authority Certificate is invalid.",
      );
    }

    if (assetSchemaAuthorityCertificate.id) {
      const id: string = assetSchemaAuthorityCertificate.id;
      await this.assetSchemaAuthorityDao.create({
        id,
        assetSchemaAuthorityCertificate,
      });
    } else {
      throw new Error("Asset Schema Authority Certificate must have an ID");
    }

    console.log(
      `Asset Schema Authority registered with ID ${assetSchemaAuthorityCertificate.id}`,
    );
    return {
      "@context": "https://www.w3.org/ns/did/v1.1",
      id: assetSchemaAuthorityCertificate.id,
      type: "RegisteredAssetSchemaAuthorityID",
    } as RegisteredAssetSchemaAuthorityID;
  }

  /**
   * Registers an Asset Provider in the registry.
   *
   * @param assetProviderCertificate - Certificate proving the provider's identity and authority.
   * @returns Promise resolving to the registered Asset Provider ID.
   */
  public async registerAssetProvider(
    assetProviderCertificate: AssetProviderCertificate,
  ): Promise<RegisteredAssetProviderID> {
    if (!assetProviderCertificate) {
      throw new Error(
        "Missing required inputs for registering the Asset Provider",
      );
    }

    if (
      !(
        await this.validationService.validateAssetProviderCertificate(
          assetProviderCertificate,
        )
      ).valid
    ) {
      throw new Error("Invalid Input: Asset Provider Certificate is invalid.");
    }

    if (assetProviderCertificate.id) {
      const id: string = assetProviderCertificate.id;
      await this.assetProviderDao.create({
        id,
        assetProviderCertificate,
      });
    } else {
      throw new Error("Asset Provider Certificate must have an ID");
    }

    console.log(
      `Asset Provider registered with ID ${assetProviderCertificate.id}`,
    );

    return {
      "@context": "https://www.w3.org/ns/did/v1.1",
      id: assetProviderCertificate.id,
      type: "RegisteredAssetProviderID",
    } as RegisteredAssetProviderID;
  }
}
