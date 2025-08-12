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
  "@context": "https://web.tecnico.ulisboa.pt/ist173130/asset-schema.jsonld",
  asset_provider: {
    name: "Acme Asset Provider",
    id: "https://example.org/asset-providers/acme",
    organization_key: {
      public_key: "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEp...xyz",
      issued: "2025-06-14T10:20:30.000Z",
    },
  },
  schema_profile:
    "https://web.tecnico.ulisboa.pt/ist173130/asset-schema.jsonld",
  network_id: "testnet-12345",
  proof: {
    type: "JwsSignature2020",
    created: "2025-06-14T12:34:56.789Z",
    proofPurpose: "assertionMethod",
    verificationMethod:
      "https://web.tecnico.ulisboa.pt/ist173130/asset-schema.jsonld",
    jws: "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..abc123",
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
  PRIVATE_KEYS_PEM,
  REGISTRY_API_SERVER,
  ASSET_SCHEMA_AUTHORITY_API_SERVER,
  ASSET_PROVIDER_API_SERVER,
  API_ENDPOINTS,
  INVALID_JSON_EXAMPLE,
  VALID_JSON_LD_EXAMPLE,
  INVALID_JSON_LD_EXAMPLE,
  VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
  INVALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT_EXAMPLE,
  VALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
  INVALID_ASSET_PROVIDER_DID_DOCUMENT_EXAMPLE,
  VALID_ASSET_SCHEMA_EXAMPLE,
  INVALID_ASSET_SCHEMA_EXAMPLE,
  VALID_ASSET_SCHEMA_DID_DOCUMENT,
  VALID_SIGNED_ASSET_SCHEMA_EXAMPLE,
  INVALID_SIGNED_ASSET_SCHEMA_EXAMPLE,
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_SIGNED_SCHEMA_PROFILE_EXAMPLE,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST,
  VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
  VALID_ASSET_SCHEMA_AUTHORITY_CERTIFICATE_EXAMPLE,
  VALID_ASSET_PROVIDER_CERTIFICATE_EXAMPLE,
};
