import fs from "fs";
import path from "path";

/**
 * DATABASE CONNECTION
 */
const IPFS_URL: string = "http://localhost:5001/api/v0";

/**
 * PRIVATE KEYS
 * This private key is used to sign asset schemas and schema profiles.
 * Ensure that the private key is kept secure and not exposed in public repositories.
 */

const assetSchemaAuthorityPrivateKeyPath = path.resolve(
  process.cwd(),
  "src/main/typescript/entities/asset-schema-authority/certificates/privateKey.pem",
);
const assetProviderPrivateKeyPath = path.resolve(
  process.cwd(),
  "src/main/typescript/entities/asset-provider/certificates/privateKey.pem",
);
const ASSET_SCHEMA_AUTHORITY_PRIVATE_KEY_PEM = fs.readFileSync(
  assetSchemaAuthorityPrivateKeyPath,
  "utf-8",
);
const ASSET_PROVIDER_PRIVATE_KEY_PEM = fs.readFileSync(
  assetProviderPrivateKeyPath,
  "utf-8",
);

const PRIVATE_KEYS_PEM = {
  ASSET_SCHEMA_AUTHORITY: ASSET_SCHEMA_AUTHORITY_PRIVATE_KEY_PEM,
  ASSET_PROVIDER: ASSET_PROVIDER_PRIVATE_KEY_PEM,
};

/**
 * API ENDPOINTS
 */
const API_ENDPOINTS = {
  ASSET_SCHEMA_AUTHORITY: {
    CERTIFICATE_ASSET_SCHEMA: "/certificate-asset-schema",
    CERTIFICATE_SCHEMA_PROFILE: "/certificate-schema-profile",
  },
  REGISTRY: {
    GET_ASSET_SCHEMA: "/get-asset-schema/:uid",
    GET_SCHEMA_PROFILE: "/get-schema-profile/:uid",
    COMMISSION_ASSET_SCHEMA: "/commission-asset-schema",
    COMMISSION_SCHEMA_PROFILE: "/commission-schema-profile",
    COMMISSION_TOKENIZED_ASSET_RECORD: "/commission-tokenized-asset-record",
  },
};

/****************************************************/
export { IPFS_URL, PRIVATE_KEYS_PEM, API_ENDPOINTS };
