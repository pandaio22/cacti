const VALID_ASSET_PROVIDER_ED25519SIGNATURE2020 = {
  type: "Ed25519Signature2020",
  contextUrl: "https://w3id.org/security/suites/ed25519-2020/v1",
  verificationMethod:
    "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV#z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
  key: {
    id: "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV#z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
    controller: "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
    type: "Ed25519VerificationKey2020",
    publicKeyMultibase: "z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
    privateKeyMultibase:
      "zrv23cs6Amg1KYgiwh2favmBXGUVrrMpoq5MBRvqfYQHbA4S6snHZ6WvBZUq7nqJYLzH9tDE7sf2zARU4jXHF9nr255",
  },
  signer: {
    id: "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV#z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
  },
  verifier: {
    id: "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV#z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
  },
  _hashCache: null,
  requiredKeyType: "Ed25519VerificationKey2020",
};

const VALID_ASSET_PROVIDER_DID_DOCUMENT = {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1",
    "https://w3id.org/security/suites/x25519-2020/v1",
  ],
  id: "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
  entity: "AssetProvider",
  name: "Example Provider",
  description: "An example Asset Provider DID Document",
  verificationMethod: [
    {
      id: "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV#z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
      type: "Ed25519VerificationKey2020",
      controller: "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
      publicKeyMultibase: "z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
    },
  ],
  authentication: [
    "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV#z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
  ],
  assertionMethod: [
    "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV#z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
  ],
  capabilityDelegation: [
    "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV#z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
  ],
  capabilityInvocation: [
    "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV#z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
  ],
  keyAgreement: [
    {
      id: "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV#z6LSfgKGDgxFvzE1yRJ3DnNKWWNGnzwNWkXosrPBcAHV9sL4",
      type: "X25519KeyAgreementKey2020",
      controller: "did:key:z6MkjCTVAV3Md4RoTA9oRg5hVaQXKiKWuwCfAbYPyFzQNvHV",
      publicKeyMultibase: "z6LSfgKGDgxFvzE1yRJ3DnNKWWNGnzwNWkXosrPBcAHV9sL4",
    },
  ],
};

export {
  VALID_ASSET_PROVIDER_DID_DOCUMENT,
  VALID_ASSET_PROVIDER_ED25519SIGNATURE2020,
};
