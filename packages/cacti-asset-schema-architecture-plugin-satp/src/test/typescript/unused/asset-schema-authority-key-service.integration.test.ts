import { KeyService } from "../../../main/typescript/entities/asset-schema-authority/modules/services/key-service";
import * as crypto from "crypto";

describe("KeyService", () => {
  let keyService: KeyService;
  let privateKey: string;
  let publicKey: string;

  beforeEach(() => {
    // Given: a KeyService instance
    keyService = new KeyService();

    // When: generating a new key pair
    const keys = keyService.generateKeyPair();
    privateKey = keys.privateKey;
    publicKey = keys.publicKey;

    console.log("Private Key:", privateKey);
    console.log("Public Key:", publicKey);
  });

  it("should generate non-empty keys", () => {
    // Then: the keys should be defined and non-empty
    expect(privateKey).toBeDefined();
    expect(publicKey).toBeDefined();
    expect(privateKey.length).toBeGreaterThan(0);
    expect(publicKey.length).toBeGreaterThan(0);
  });

  it("should generate keys in valid PEM format", () => {
    // Then: the keys should be in valid PEM format
    expect(privateKey).toMatch(/-----BEGIN PRIVATE KEY-----/);
    expect(privateKey).toMatch(/-----END PRIVATE KEY-----/);
    expect(publicKey).toMatch(/-----BEGIN PUBLIC KEY-----/);
    expect(publicKey).toMatch(/-----END PUBLIC KEY-----/);
  });

  it("should generate valid EC keys when parsed", () => {
    // Then: the keys should be valid EC keys when parsed
    const parsedPrivateKey = crypto.createPrivateKey({
      key: privateKey,
      format: "pem",
    });
    const parsedPublicKey = crypto.createPublicKey({
      key: publicKey,
      format: "pem",
    });

    console.log("Parsed Private Key Type:", parsedPrivateKey.asymmetricKeyType);
    console.log("Parsed Public Key Type:", parsedPublicKey.asymmetricKeyType);

    expect(parsedPrivateKey.asymmetricKeyType).toBe("ec");
    expect(parsedPublicKey.asymmetricKeyType).toBe("ec");
  });
});
