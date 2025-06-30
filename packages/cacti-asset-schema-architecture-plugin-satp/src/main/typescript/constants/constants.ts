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
 * API SERVERS
 */
const REGISTRY_API_SERVER: string = "http://localhost:3000";
const ASSET_SCHEMA_AUTHORITY_API_SERVER: string = "http://localhost:3010";
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
 * SCHEMAS
 */
const VALID_ASSET_SCHEMA_EXAMPLE = {
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
    fungible: {
      "@id": "https://example.org/fungibility",
      "@type": "https://schema.org/Boolean",
    },
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
  "@id": "https://satp.example.org/asset_schema/organization/12345",
  "foaf:name": "Example Corp",
  organization_key: {
    public_key: "0xabcdef1234567890",
    issued: "2025-05-31T10:00:00Z",
  },
  facets: {
    "skos:note": "A sample asset representing an organization with a key",
    "schema:category": "financial",
  },
  description: "An example asset schema for an organization",
  fungible: true,
  schema_version: 1.0,
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

const VALID_SCHEMA_PROFILE_EXAMPLE = {
  "@context": {
    "@version": 1.1,
    asset_schema: "did:ipfs:QmYdfWp9FKS1EshoKeyjZHwRXgn6ognPFV9EbN25qhAWfP",
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
  "@id": "https://www.culture.example.org/asset_profile",
  "schema:title": "Asset Profile for Cultural Assets",
  "schema:organization": {
    "@id": "https://www.culture.example.org/",
    "schema:email": "info@culture.example.org",
    "asset_schema:organization_key": {
      public_key:
        "did:v1:test:nym:JApJf12r82Pe6PBJ3gJAAwo8F7uDnae6B4ab9EFQ7XXk#authn-key-1",
      issued: "2018-03-15T00:00:00Z",
    },
  },
  "asset_schema:facets": {
    owmner_transferability: "non-transferable",
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
  "@context": "urn:tar:eip155.137:0x517BBF0c9B71f64b5807f644E1F1bacD3Afb3ec2",
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
  VALID_ASSET_SCHEMA_EXAMPLE,
  VALID_SIGNED_ASSET_SCHEMA_EXAMPLE,
  VALID_SCHEMA_PROFILE_EXAMPLE,
  VALID_SIGNED_SCHEMA_PROFILE_EXAMPLE,
  VALID_TOKEN_ISSUANCE_AUTHORIZATION_REQUEST,
  VALID_TOKENIZED_ASSET_RECORD_EXAMPLE,
  VALID_ASSET_SCHEMA_AUTHORITY_CERTIFICATE_EXAMPLE,
  VALID_ASSET_PROVIDER_CERTIFICATE_EXAMPLE,
};
