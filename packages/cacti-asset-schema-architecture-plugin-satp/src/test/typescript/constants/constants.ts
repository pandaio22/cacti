import fs from "fs";
import path from "path";
import { title } from "process";

/**
 * DATABASE CONNECTION
 */
const IPFS_URL: string = "http://localhost:5001/api/v0";

/**
 * PRIVATE KEYS
 * This private key is used to sign asset schemas and schema profiles.
 * Ensure that the private key is kept secure and not exposed in public repositories.
 */
/*
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
*/
/**
 * API SERVERS
 */
const REGISTRY_API_SERVER: string = "http://localhost:3000";
const ASSET_SCHEMA_AUTHORITY_API_SERVER: string = "http://localhost:3002";
const ASSET_PROVIDER_API_SERVER: string = "http://localhost:3020";
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

/**
 * JSON EXAMPLES
 */
const INVALID_JSON_EXAMPLE = 123123;
/**
 * JSON-LD EXAMPLES
 */
const VALID_JSON_LD_EXAMPLE = {
  "@context": {
    name: "http://schema.org/name",
    image: {
      "@id": "http://schema.org/image",
      "@type": "@id",
    },
    homepage: {
      "@id": "http://schema.org/url",
      "@type": "@id",
    },
  },
  name: "Manu Sporny",
  homepage: "http://manu.sporny.org/",
  image: "http://manu.sporny.org/images/manu.png",
};

const INVALID_JSON_LD_EXAMPLE = {
  context: {
    name: "http://schema.org/name",
    image: {
      "@id": "http://schema.org/image",
      "@type": "@id",
    },
    homepage: {
      "@id": "http://schema.org/url",
      "@type": "@id",
    },
  },
  name: "Manu Sporny",
  homepage: "http://manu.sporny.org/",
  image: "http://manu.sporny.org/images/manu.png",
};

/**
 * DID DOCUMENT EXAMPLES
 */
const VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020 = {
  type: "Ed25519Signature2020",
  contextUrl: "https://w3id.org/security/suites/ed25519-2020/v1",
  verificationMethod:
    "did:key:z6Mkfyv8zT7vg2zDTzTfv3MBhWsyxHFY3mMnfMv6xAaepc8J#z6Mkfyv8zT7vg2zDTzTfv3MBhWsyxHFY3mMnfMv6xAaepc8J",
  key: {
    id: "did:key:z6Mkfyv8zT7vg2zDTzTfv3MBhWsyxHFY3mMnfMv6xAaepc8J#z6Mkfyv8zT7vg2zDTzTfv3MBhWsyxHFY3mMnfMv6xAaepc8J",
    controller: "did:key:z6Mkfyv8zT7vg2zDTzTfv3MBhWsyxHFY3mMnfMv6xAaepc8J",
    type: "Ed25519VerificationKey2020",
    publicKeyMultibase: "z6Mkfyv8zT7vg2zDTzTfv3MBhWsyxHFY3mMnfMv6xAaepc8J",
    privateKeyMultibase:
      "zrv3XdTCdbtRBVZMyRYkBS3oh4ns1zp8hEb7kyE8MhUBNmTe9oBwvCPSy4cSRT4m5p1gZnH8p3SY4NBjhE1STxUrWft",
  },
  signer: {
    id: "did:key:z6Mkfyv8zT7vg2zDTzTfv3MBhWsyxHFY3mMnfMv6xAaepc8J#z6Mkfyv8zT7vg2zDTzTfv3MBhWsyxHFY3mMnfMv6xAaepc8J",
  },
  verifier: {
    id: "did:key:z6Mkfyv8zT7vg2zDTzTfv3MBhWsyxHFY3mMnfMv6xAaepc8J#z6Mkfyv8zT7vg2zDTzTfv3MBhWsyxHFY3mMnfMv6xAaepc8J",
  },
  _hashCache: null,
  requiredKeyType: "Ed25519VerificationKey2020",
};

const VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT = {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1",
    "https://w3id.org/security/suites/x25519-2020/v1",
  ],
  id: "did:key:z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T",
  entity: "AssetSchemaAuthority",
  name: "Example Asset Schema Authority",
  description: "An example Asset Schema Authority DID Document",
  verificationMethod: [
    {
      id: "did:key:z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T#z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T",
      type: "Ed25519VerificationKey2020",
      controller: "did:key:z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T",
      publicKeyMultibase: "z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T",
    },
  ],
  authentication: [
    "did:key:z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T#z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T",
  ],
  assertionMethod: [
    "did:key:z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T#z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T",
  ],
  capabilityDelegation: [
    "did:key:z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T#z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T",
  ],
  capabilityInvocation: [
    "did:key:z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T#z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T",
  ],
  keyAgreement: [
    {
      id: "did:key:z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T#z6LSotGbgPCJD2Y6TSvvgxERLTfVZxCh9KSrez3WNrNp7vKW",
      type: "X25519KeyAgreementKey2020",
      controller: "did:key:z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T",
      publicKeyMultibase: "z6LSotGbgPCJD2Y6TSvvgxERLTfVZxCh9KSrez3WNrNp7vKW",
    },
  ],
};
const VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE = {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://example.org/AssetSchemaAuthority",
  ],
  id: "did:example:123456789abcdefghi",
  entity: "AssetSchemaAuthority",
  name: "Example Asset Schema Authority",
  description: "An example Asset Schema Authority DID Document",
  verificationMethod: [
    {
      id: "did:example:123456789abcdefghi#key-1",
      type: "Ed25519VerificationKey2018",
      controller: "did:example:123456789abcdefghi",
      publicKeyBase58: "H3C2AVvLMfjaNqsw1Jd96YQz9Y3X1bB",
    },
  ],
  authentication: ["did:example:123456789abcdefghi#key-1"],
  service: [
    {
      id: "did:example:123456789abcdefghi#linked-domain",
      type: "LinkedDomains",
      serviceEndpoint: "https://example.com",
    },
  ],
};

const INVALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE = {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://example.org/AssetSchemaAuthority",
  ],
  id: "did:example:123456789abcdefghi",
  entity: "AssetProvider", // Invalid entity type
  name: "Example Asset Schema Authority",
  description: "An example Asset Schema Authority DID Document",
  verificationMethod: [
    {
      id: "did:example:123456789abcdefghi#key-1",
      type: "Ed25519VerificationKey2018",
      controller: "did:example:123456789abcdefghi",
      publicKeyBase58: "H3C2AVvLMfjaNqsw1Jd96YQz9Y3X1bB",
    },
  ],
  authentication: ["did:example:123456789abcdefghi#key-1"],
  service: [
    {
      id: "did:example:123456789abcdefghi#linked-domain",
      type: "LinkedDomains",
      serviceEndpoint: "https://example.com",
    },
  ],
};

const VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE = {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://example.org/AssetProvider",
  ],
  id: "did:example:123456789abcdefghi",
  entity: "AssetProvider",
  name: "Example Asset Provider",
  description: "An example Asset Provider DID Document",
  verificationMethod: [
    {
      id: "did:example:123456789abcdefghi#key-1",
      type: "Ed25519VerificationKey2018",
      controller: "did:example:123456789abcdefghi",
      publicKeyBase58: "H3C2AVvLMfjaNqsw1Jd96YQz9Y3X1bB",
    },
  ],
  authentication: ["did:example:123456789abcdefghi#key-1"],
  service: [
    {
      id: "did:example:123456789abcdefghi#linked-domain",
      type: "LinkedDomains",
      serviceEndpoint: "https://example.com",
    },
  ],
};

const INVALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE = {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://example.org/AssetProvider",
  ],
  id: "did:example:123456789abcdefghi",
  entity: "Not an AssetProvider",
  name: "Example Asset Provider",
  description: "An example Asset Provider DID Document",
  verificationMethod: [
    {
      id: "did:example:123456789abcdefghi#key-1",
      type: "Ed25519VerificationKey2018",
      controller: "did:example:123456789abcdefghi",
      publicKeyBase58: "H3C2AVvLMfjaNqsw1Jd96YQz9Y3X1bB",
    },
  ],
  authentication: ["did:example:123456789abcdefghi#key-1"],
  service: [
    {
      id: "did:example:123456789abcdefghi#linked-domain",
      type: "LinkedDomains",
      serviceEndpoint: "https://example.com",
    },
  ],
};

const VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE = {
  "@context": ["https://www.w3.org/ns/did/v1"],
  id: "did:web:example.com:asset-schema",
  type: ["DIDDocument", "AssetSchemaDidDocument"],
  verificationMethod: [
    {
      id: "did:web:example.com:asset-schema#controller",
      type: "Ed25519VerificationKey2020",
      controller: "did:web:example.com:controller",
      publicKeyMultibase: "H3C2AVvLMf2pX...",
    },
  ],
  authentication: ["did:web:example.com:asset-schema#controller"],
  assertionMethod: ["did:web:example.com:asset-schema#controller"],
};

const VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE = {
  "@context": ["https://www.w3.org/ns/did/v1"],
  id: "did:web:example.com:schema-profile",
  type: ["DIDDocument", "SchemaProfileDidDocument"],
  verificationMethod: [
    {
      id: "did:web:example.com:schema-profile#controller",
      type: "Ed25519VerificationKey2020",
      controller: "did:web:example.com:controller",
      publicKeyMultibase: "H3C2AVvLMf2pX...",
    },
  ],
  authentication: ["did:web:example.com:schema-profile#controller"],
  assertionMethod: ["did:web:example.com:schema-profile#controller"],
};

/**
 * SCHEMAS
 */
const VALID_ASSET_SCHEMA_EXAMPLE = {
  "@context": {
    "@version": 1.1,
    asset_schema: "https://schema.org/assetSchema",
    schema_version: {
      "@id": "https://schema.org/schemaVersion",
      "@type": "@id",
    },
    foaf: "http://xmlns.com/foaf/0.1/",
    schema: "http://schema.org/",
    skos: "http://www.w3.org/2004/02/skos/core#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    title: {
      "@id": "https://schema.org/title",
      "@type": "schema:string",
    },
    fungible: {
      "@id": "https://example.org/fungibility",
      "@type": "https://schema.org/Boolean",
    },
    organization_key: {
      "@id": "https://satp.example.org/asset_schema_org_key",
      "@context": {
        "@protected": true,
        id: "@id",
        type: "@type",
        public_key: {
          "@id": "https://gateway.satp.ietf.org/asset_schema_pub_key",
          "@type": "schema:string",
        },
        issued: {
          "@id": "https://gateway.satp.ietf.org/asset_schema_key_issued",
          "@type": "schema:string",
        },
      },
    },
    facets: {
      "@id": "https://satp.example.org/asset_schema_facets",
    },
  },
  "@id": "did:example:123456789abcdefghi#",
};

const INVALID_ASSET_SCHEMA_EXAMPLE = {
  "@context": {
    "@version": 1.1,
    schema_version: {
      "@id": "https://schema.org/schemaVersion",
      "@type": "@id",
    },
    foaf: "http://xmlns.com/foaf/0.1/",
    schema: "http://schema.org/",
    skos: "http://www.w3.org/2004/02/skos/core#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    organization_key: {
      "@id": "https://satp.example.org/asset_schema_org_key",
      "@context": {
        public_key: {
          "@id": "https://gateway.satp.ietf.org/asset_schema_pub_key",
          "@type": "schema:string",
        },
        issued: {
          "@id": "https://gateway.satp.ietf.org/asset_schema_key_issued",
          "@type": "schema:string",
        },
      },
    },
    facets: {
      "@id": "https://satp.example.org/asset_schema_facets",
    },
  },
  "@id": "did:example:123456789abcdefghi#asset-schema",
};

const VALID_ASSET_SCHEMA_DID_DOCUMENT = {
  "@context": "https://w3id.org/did/v1",
  id: "did:example:123456789abcdefghi",
  service: [
    {
      id: "#assetSchema",
      type: "AssetSchema",
      serviceEndpoint: "https://example.org/asset-schema.jsonld",
    },
  ],
};

const VALID_SIGNED_ASSET_SCHEMA_EXAMPLE = {
  asset_schema: { ...VALID_ASSET_SCHEMA_EXAMPLE },
  proof: {
    type: "EcdsaSecp256k1VerificationKey2019", // example proof type
    created: "2025-06-27T12:00:00Z", // ISO 8601 date string
    proofPurpose: "assertionMethod", // purpose of proof, e.g., authentication or assertion
    verificationMethod: "https://example.org/keys/1", // URL or DID key identifier
    jws: "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...", // a JSON Web Signature string (example)
  },
};

const INVALID_SIGNED_ASSET_SCHEMA_EXAMPLE = {
  asset_schema: { ...INVALID_ASSET_SCHEMA_EXAMPLE },
  proof: {
    type: "EcdsaSecp256k1VerificationKey2019", // example proof type
    created: "2025-06-27T12:00:00Z", // ISO 8601 date string
    proofPurpose: "assertionMethod", // purpose of proof, e.g., authentication or assertion
    verificationMethod: "https://example.org/keys/1", // URL or DID key identifier
    jws: "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...", // a JSON Web Signature string (example)
  },
};

const VALID_SCHEMA_PROFILE_EXAMPLE = {
  "@context": [
    { "@version": 1.1 },
    "did:example:123456789abcdefghi#",
    {
      dcap: {
        "@id": "https://www.culture.example.org/asset_profile/dcap",
        "@context": {
          rwa: {
            "@id": "https://www.culture.example.org/asset_profile/rwa",
            "@context": {
              digital_carrier_id: {
                "@id":
                  "https://www.culture.example.org/asset_profile/digital_carrier_id",
                "@type": "schema:string",
              },
              digital_carrier_type: {
                "@id":
                  "https://www.culture.example.org/asset_profile/digital_carrier_type",
                "@type": "schema:string",
              },
              rwa_kind: {
                "@id": "https://www.culture.example.org/asset_profile/rwa_kind",
                "@container": "@language",
              },
              rwa_description: {
                "@id":
                  "https://www.culture.example.org/asset_profile/rwa_description",
                "@container": "@language",
              },
              rwa_current_storage: {
                "@id":
                  "https://www.culture.example.org/asset_profile/rwa_current_storage",
                "@container": "@language",
              },
              rwa_storage_location: {
                "@id":
                  "https://www.culture.example.org/asset_profile/rwa_storage_location",
                "@container": "@language",
              },
            },
          },
          dar: {
            "@id": "https://www.culture.example.org/asset_profile/dar",
            "@context": {
              dar_id: {
                "@id": "https://www.culture.example.org/asset_profile/dar_id",
                "@type": "schema:string",
              },
              dar_system_id: {
                "@id":
                  "https://www.culture.example.org/asset_profile/dar_system_id",
                "@type": "schema:string",
              },
              dar_url: {
                "@id": "https://www.culture.example.org/asset_profile/dar_url",
                "@type": "schema:url",
              },
              dar_description: {
                "@id":
                  "https://www.culture.example.org/asset_profile/dar_description",
                "@container": "@language",
              },
            },
          },
        },
      },
    },
    {
      tokenized_issuance_authorization:
        "https://example.org/tokenissuanceauthorization",
    },
    {
      schema_profile: "https://example.org/schemaprofile",
    },
  ],
  "@id": "did:example:56745689abcdefghi",
  title: "Asset Profile for Cultural Assets",
  asset_schema: "did:example:123456789abcdefghi#assetSchema",
  fungible: false,
  organization_key: {
    public_key: "did:example:abc123#keys-1",
    issued: "2025-08-12T12:00:00Z",
  },
  facets: {
    owner_transferability: "non-transferable",
    network_transferability: "evm_compatible_network",
    jurisdiction: {
      ownerJurisdictionScope: {
        law: "https://www.officialjoutrnal.example.org/eli/law/yyyy/nnnn/enacted/data.json",
        territory: "Some country",
      },
    },
  },
};

const XVALID_SCHEMA_PROFILE_EXAMPLE = {
  "@context": {
    "@version": 1.1,
    asset_schema: "did:example:123456789abcdefghi#",
    assetschema: {
      "@id": "did:example:123456789abcdefghi#",
      "@prefix": true,
    },
    dcap: {
      "@id": "https://www.culture.example.org/asset_profile/dcap",
      "@context": {
        rwa: {
          "@id": "https://www.culture.example.org/asset_profile/rwa",
          "@context": {
            digital_carrier_id: {
              "@id":
                "https://www.culture.example.org/asset_profile/digital_carrier_id",
              "@type": "schema:string",
            },
            digital_carrier_type: {
              "@id":
                "https://www.culture.example.org/asset_profile/digital_carrier_type",
              "@type": "schema:string",
            },
            rwa_kind: {
              "@id": "https://www.culture.example.org/asset_profile/rwa_kind",
              "@container": "@language",
            },
            rwa_description: {
              "@id":
                "https://www.culture.example.org/asset_profile/rwa_description",
              "@container": "@language",
            },
            rwa_current_storage: {
              "@id":
                "https://www.culture.example.org/asset_profile/rwa_current_storage",
              "@container": "@language",
            },
            rwa_storage_location: {
              "@id":
                "https://www.culture.example.org/asset_profile/rwa_storage_location",
              "@container": "@language",
            },
          },
        },
        dar: {
          "@id": "https://www.culture.example.org/asset_profile/dar",
          "@context": {
            dar_id: {
              "@id": "https://www.culture.example.org/asset_profile/dar_id",
              "@type": "schema:string",
            },
            dar_system_id: {
              "@id":
                "https://www.culture.example.org/asset_profile/dar_system_id",
              "@type": "schema:string",
            },
            dar_url: {
              "@id": "https://www.culture.example.org/asset_profile/dar_url",
              "@type": "schema:url",
            },
            dar_description: {
              "@id":
                "https://www.culture.example.org/asset_profile/dar_description",
              "@container": "@language",
            },
          },
        },
      },
    },
    description: "https://schema.org/description",
    title: "https://schema.org/title",
    token_issuance_authorization:
      "https://example.org/tokenissuanceauthorization",
  },
  "@id": "did:example:56745689abcdefghi#schema-profile",
  "schema:title": "Asset Profile for Cultural Assets",
  "asset_schema:fungible": false,
  "asset_schema:organization_key": {
    public_key: "did:example:abc123#keys-1",
    issued: "2025-08-12T12:00:00Z",
  },
  "asset_schema:facets": {
    owner_transferability: "non-transferable",
    network_transferability: "evm_compatible_network",
    jurisdiction: {
      ownerJurisdictionScope: {
        law: "https://www.officialjoutrnal.example.org/eli/law/yyyy/nnnn/enacted/data.json",
        territory: "Some country",
      },
    },
  },
};

const VALID_SIGNED_SCHEMA_PROFILE_EXAMPLE = {
  schema_profile: { ...VALID_SCHEMA_PROFILE_EXAMPLE },
  proof: {
    type: "EcdsaSecp256k1VerificationKey2019", // example proof type
    created: "2025-06-27T12:00:00Z", // ISO 8601 date string
    proofPurpose: "assertionMethod", // purpose of proof, e.g., authentication or assertion
    verificationMethod: "https://example.org/keys/1", // URL or DID key identifier
    jws: "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...", // a JSON Web Signature string (example)
  },
};

const VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST = {
  "@context": [
    "https://www.w3.org/2018/credentials/v2",
    "https://example.org/contexts/token-issuance-authorization/v1",
  ],
  id: "urn:uuid:5d58e6a2-38f7-4d92-9f4e-1b5d56f6c981",
  type: ["VerifiableCredential", "TokenIssuanceAuthorizationRequest"],
  issuer: "did:example:asset-schema-authority-123",
  issuanceDate: "2025-08-13T10:15:00Z",
  validFrom: "2025-08-13T10:15:00Z",
  validUntil: "2025-09-13T10:15:00Z",
  credentialSubject: {
    assetProvider: {
      name: "Example Asset Provider Ltd.",
      id: "did:example:asset-provider-123",
      organizationKey: {
        publicKey: "z6MktY1rYQ2pF7bL5vJxVnAf3uC4oM2rTfq2aX6rQf8xPz",
        issued: "2025-08-01T08:00:00Z",
      },
    },
    schemaProfile: {
      id: "https://example.org/schema-profiles/real-estate-v1",
    },
    networkId: "mainnet-registry-01",
  },
  proof: {
    type: "DataIntegrityProof",
    verificationMethod: "did:example:asset-provider-123#org-key",
    cryptosuite: "eddsa-rdfc-2022",
    created: "2025-08-13T10:16:00Z",
    proofPurpose: "assertionMethod",
    proofValue: "z4Z7eTtRC3kBb9zN8...",
  },
};

const VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST_TEST = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.example.org/schema-profile/vc/v1",
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1",
  ],
  id: "https://www.example.org/token-issuance-authorization-request/cdf2913a32fe6a8b7b93340a4d9f8c5324eef1d2d293ac9bd6c449f969d664a9",
  type: ["VerifiableCredential", "TokenIssuanceAuthorizationRequest"],
  issuer: "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
  issuanceDate: "2025-08-26T15:32:32.797Z",
  credentialSubject: {
    id: "did:web:example.com:schema-profile",
    assetProvider: {
      name: "Example Provider",
      id: "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
      organizationKey: {
        publicKey: "z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
        type: "Ed25519VerificationKey2020",
        issued: "2025-08-20T15:32:32.797Z",
      },
    },
    networkId: "Ethereum",
    name: "Token Issuance Authorization Request",
    version: "1.0.0",
    hash: "cdf2913a32fe6a8b7b93340a4d9f8c5324eef1d2d293ac9bd6c449f969d664a9",
    nonce: "179e76d999fa7c6edb9f09296dc9dfbf",
    createdBy: "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
    schema: "did:web:example.com:schema-profile",
    schemaProfile: {
      id: "did:web:example.com:schema-profile",
    },
  },
  proof: {
    type: "Ed25519Signature2020",
    cryptosuite: "Ed25519Signature2020",
    created: "2025-08-26T15:32:32Z",
    verificationMethod:
      "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV#z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
    proofPurpose: "assertionMethod",
    proofValue:
      "z2ViKtjuZtqF77XTT2oQTNm6SdNbu9CcDNwSes2EWN5jduUKBhaPoKwKQMNELpXzf6iEoq3ogFRQpTxhcU7dpMGiD",
  },
};

const VALID_TOKEN_ISSUANCE_AUTHORIZATION = {
  "@context": [
    "https://www.w3.org/2018/credentials/v2",
    "https://example.org/contexts/token-issuance-authorization/v1",
  ],
  type: ["VerifiablePresentation", "TokenIssuanceAuthorization"],
  issuer: "did:example:asset-schema-authority-456",
  holder: "did:example:asset-provider-123",
  verifiableCredential: [
    {
      "@context": [
        "https://www.w3.org/2018/credentials/v2",
        "https://example.org/contexts/token-issuance-authorization/v1",
      ],
      id: "urn:uuid:5d58e6a2-38f7-4d92-9f4e-1b5d56f6c981",
      type: ["VerifiableCredential", "TokenIssuanceAuthorizationRequest"],
      issuer: "did:example:asset-provider-123",
      issuanceDate: "2025-08-13T10:15:00Z",
      validFrom: "2025-08-13T10:15:00Z",
      validUntil: "2025-09-13T10:15:00Z",
      credentialSubject: {
        assetProvider: {
          name: "Example Asset Provider Ltd.",
          id: "did:example:asset-provider-123",
          organizationKey: {
            publicKey: "z6MktY1rYQ2pF7bL5vJxVnAf3uC4oM2rTfq2aX6rQf8xPz",
            issued: "2025-08-01T08:00:00Z",
          },
        },
        schemaProfile: {
          id: "https://example.org/schema-profiles/real-estate-v1",
        },
        networkId: "mainnet-registry-01",
      },
      proof: {
        type: "DataIntegrityProof",
        verificationMethod: "did:example:asset-provider-123#org-key",
        cryptosuite: "eddsa-rdfc-2022",
        created: "2025-08-13T10:16:00Z",
        proofPurpose: "assertionMethod",
        proofValue: "z4Z7eTtRC3kBb9zN8...",
      },
    },
  ],
  proof: {
    type: "DataIntegrityProof",
    verificationMethod: "did:example:asset-schema-authority-456#auth-key",
    cryptosuite: "eddsa-rdfc-2022",
    created: "2025-08-13T10:20:00Z",
    proofPurpose: "assertionMethod",
    proofValue: "z9Y2eUhXkV3qPa2nM...",
  },
};

const VALID_TOKENIZED_ASSET_RECORD_EXAMPLE = {
  "@context": [{ "@version": 1.1 }, "did:example:56745689abcdefghi#"],
  schema_profile: "did:example:56745689abcdefghi#schema-profile",
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

const VALID_ASSET_SCHEMA_AUTHORITY_CERTIFICATE_EXAMPLE = {
  "@context": "https://www.w3.org/2018/credentials/v1",
  "@id": "https://example.org/authority/ada-root-ca",
  type: "AssetSchemaAuthority",
  certificate:
    "-----BEGIN CERTIFICATE-----\nMIICbTCCAhOgAwIBAgIUKGMtkCglYtTvCm8Z/HJwR4RzWj8wCgYIKoZIzj0EAwIw\ngYsxCzAJBgNVBAYTAlVTMRYwFAYDVQQIDA1NYXNzYWNodXNldHRzMQ8wDQYDVQQH\nDAZCb3N0b24xHzAdBgNVBAoMFkFzc2V0IFNjaGVtYSBBdXRob3JpdHkxEDAOBgNV\nBAsMB1Jvb3QgQ0ExIDAeBgNVBAMMF2FkYS1yb290LWNhLmV4YW1wbGUub3JnMB4X\nDTI1MDYxMzEyMjI0MVoXDTM1MDYxMTEyMjI0MVowgYsxCzAJBgNVBAYTAlVTMRYw\nFAYDVQQIDA1NYXNzYWNodXNldHRzMQ8wDQYDVQQHDAZCb3N0b24xHzAdBgNVBAoM\nFkFzc2V0IFNjaGVtYSBBdXRob3JpdHkxEDAOBgNVBAsMB1Jvb3QgQ0ExIDAeBgNV\nBAMMF2FkYS1yb290LWNhLmV4YW1wbGUub3JnMFkwEwYHKoZIzj0CAQYIKoZIzj0D\nAQcDQgAETSmp2J4QAouMrJk7VttKD3MVdJIVXUpsck8UByNbuC2SRMqVhb9wzIhN\nsYAuLMP0qbXlhPEGq/V7um11UkuacqNTMFEwHQYDVR0OBBYEFDr9JbelgDJGvBle\nEFX1v3CW0ro3MB8GA1UdIwQYMBaAFDr9JbelgDJGvBleEFX1v3CW0ro3MA8GA1Ud\nEwEB/wQFMAMBAf8wCgYIKoZIzj0EAwIDSAAwRQIgNV5YpT+o4h0yIv0sX2xC7f/9\ndSork0HKHyOUfkWdEXICIQDUhnStzzpjthQ9zgFnwDc4G2HNXDORPQOqW9bp5UPe\nWw==\n-----END CERTIFICATE-----",
};

const VALID_ASSET_PROVIDER_CERTIFICATE_EXAMPLE = {
  "@context": "https://www.w3.org/2018/credentials/v1",
  "@id": "https://example.org/asset-provider/ada-root-ca",
  type: "AssetProvider",
  certificate:
    "-----BEGIN CERTIFICATE-----\nMIICbTCCAhOgAwIBAgIUKGMtkCglYtTvCm8Z/HJwR4RzWj8wCgYIKoZIzj0EAwIw\ngYsxCzAJBgNVBAYTAlVTMRYwFAYDVQQIDA1NYXNzYWNodXNldHRzMQ8wDQYDVQQH\nDAZCb3N0b24xHzAdBgNVBAoMFkFzc2V0IFNjaGVtYSBBdXRob3JpdHkxEDAOBgNV\nBAsMB1Jvb3QgQ0ExIDAeBgNVBAMMF2FkYS1yb290LWNhLmV4YW1wbGUub3JnMB4X\nDTI1MDYxMzEyMjI0MVoXDTM1MDYxMTEyMjI0MVowgYsxCzAJBgNVBAYTAlVTMRYw\nFAYDVQQIDA1NYXNzYWNodXNldHRzMQ8wDQYDVQQHDAZCb3N0b24xHzAdBgNVBAoM\nFkFzc2V0IFNjaGVtYSBBdXRob3JpdHkxEDAOBgNVBAsMB1Jvb3QgQ0ExIDAeBgNV\nBAMMF2FkYS1yb290LWNhLmV4YW1wbGUub3JnMFkwEwYHKoZIzj0CAQYIKoZIzj0D\nAQcDQgAETSmp2J4QAouMrJk7VttKD3MVdJIVXUpsck8UByNbuC2SRMqVhb9wzIhN\nsYAuLMP0qbXlhPEGq/V7um11UkuacqNTMFEwHQYDVR0OBBYEFDr9JbelgDJGvBle\nEFX1v3CW0ro3MB8GA1UdIwQYMBaAFDr9JbelgDJGvBleEFX1v3CW0ro3MA8GA1Ud\nEwEB/wQFMAMBAf8wCgYIKoZIzj0EAwIDSAAwRQIgNV5YpT+o4h0yIv0sX2xC7f/9\ndSork0HKHyOUfkWdEXICIQDUhnStzzpjthQ9zgFnwDc4G2HNXDORPQOqW9bp5UPe\nWw==\n-----END CERTIFICATE-----",
};

/****************************************************/
export {
  IPFS_URL,
  //PRIVATE_KEYS_PEM,
  REGISTRY_API_SERVER,
  ASSET_SCHEMA_AUTHORITY_API_SERVER,
  ASSET_PROVIDER_API_SERVER,
  API_ENDPOINTS,
  INVALID_JSON_EXAMPLE,
  VALID_JSON_LD_EXAMPLE,
  INVALID_JSON_LD_EXAMPLE,
  VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020,
  VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT,
  VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
  INVALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
  VALID_ASSET_SCHEMA_DID_DOCUMENT_EXAMPLE,
  VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
  INVALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
  VALID_ASSET_SCHEMA_EXAMPLE,
  INVALID_ASSET_SCHEMA_EXAMPLE,
  VALID_ASSET_SCHEMA_DID_DOCUMENT,
  VALID_SIGNED_ASSET_SCHEMA_EXAMPLE,
  INVALID_SIGNED_ASSET_SCHEMA_EXAMPLE,
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_SCHEMA_PROFILE_DID_DOCUMENT_EXAMPLE,
  VALID_SIGNED_SCHEMA_PROFILE_EXAMPLE,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST_TEST,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION,
  VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
  VALID_ASSET_SCHEMA_AUTHORITY_CERTIFICATE_EXAMPLE,
  VALID_ASSET_PROVIDER_CERTIFICATE_EXAMPLE,
};
