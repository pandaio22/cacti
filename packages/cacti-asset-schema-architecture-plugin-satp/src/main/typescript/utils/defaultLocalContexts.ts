import fs from "fs";
import path from "path";

function loadContext(fileName: string) {
  return JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../json-ld/contexts", fileName),
      "utf-8",
    ),
  );
}

const didV1Context = loadContext("did-v1.jsonld");
const didV1ContextAssetSchema = loadContext(
  "asset-schema-did-document-added.jsonld",
);
const assetSchemaContext = loadContext("asset-schema.jsonld");
const assetSchemaVerifiableCredentialContext = loadContext(
  "asset-schema-verifiable-credential.jsonld",
);
const schemaProfileContext = loadContext("schema-profile.jsonld");
const schemaProfileVerifiableCredentialContext = loadContext(
  "schema-profile-verifiable-credential.jsonld",
);
const verifiableCredentialsContextTest = loadContext("test-vc-1.jsonld");
const verifiableCredentialsContextV1 = loadContext(
  "verifiable-credentials-v1.jsonld",
);
const verifiableCredentialsContext = loadContext(
  "verifiable-credentials-v2.jsonld",
);
const ed255192020 = loadContext("ed25519-2020.jsonld");
const tokenIssuanceAuthorizationContext = loadContext(
  "token-issuance-authorization.jsonld",
);

export const DEFAULT_LOCAL_CONTEXTS: Record<string, any> = {
  "https://www.w3.org/ns/did/v1": didV1Context,
  "https://www.example.org/ns/did/v1/asset-schema": didV1ContextAssetSchema,
  "https://www.example.org/asset-schema/vc/v1":
    assetSchemaVerifiableCredentialContext,
  "https://www.example.org/schema-profile/v1": schemaProfileContext,
  "https://www.example.org/schema-profile/vc/v1":
    schemaProfileVerifiableCredentialContext,
  "https://www.w3.org/2018/credentials/v1": verifiableCredentialsContextTest,
  "https://www.w3.org/ns/credentials/v1": verifiableCredentialsContextV1,
  "https://www.w3.org/ns/credentials/v2": verifiableCredentialsContext,
  "https://w3id.org/security/suites/ed25519-2020/v1": ed255192020,
  "https://www.example.org/token-issuance-authorization/v1":
    tokenIssuanceAuthorizationContext,
  "did:example:123456789abcdefghi#": assetSchemaContext,
};
