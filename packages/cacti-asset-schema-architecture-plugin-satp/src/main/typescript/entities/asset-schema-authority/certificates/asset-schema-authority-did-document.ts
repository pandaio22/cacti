const VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020 = {
  type: "Ed25519Signature2020",
  contextUrl: "https://w3id.org/security/suites/ed25519-2020/v1",
  verificationMethod:
    "did:key:z6Mkfyv8zT7vg2zDTzTfv3MBhWsyxHFY3mMnfMv6xAaepc8J",
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

export {
  VALID_ASSET_SCHEMA_AUTHORITY_DID_DOCUMENT,
  VALID_ASSET_SCHEMA_AUTHORITY_ED25519SIGNATURE2020,
};
