import { SignatureService } from "../../../../../main/typescript/entities/asset-definition-authority/modules/services/signature-service";
import { KeyService } from "../../../../../main/typescript/entities/asset-definition-authority/modules/services/key-service";

const sampleDocument = {
  "@context": {
    name: "http://schema.org/name",
    age: "http://schema.org/age",
  },
  name: "John Doe",
  age: 30,
};

describe("SignatureService", () => {
  let keyService: KeyService;
  let signatureService: SignatureService;
  let keys: { privateKey: string; publicKey: string };

  beforeEach(() => {
    // Given: Initialize services and generate key pair
    console.log("🔧 Setting up test environment...");
    keyService = new KeyService();
    signatureService = new SignatureService();
    keys = keyService.generateKeyPair();

    console.log("📋 Sample document:", JSON.stringify(sampleDocument, null, 2));
    console.log("🔑 Generated key pair");
    console.log(
      "🔐 Private key (first 50 chars):",
      keys.privateKey.substring(0, 50) + "...",
    );
    console.log(
      "🔓 Public key (first 50 chars):",
      keys.publicKey.substring(0, 50) + "...",
    );
  });

  it("should sign and verify a JSON-LD document", async () => {
    console.log("\n🧪 Test: should sign and verify a JSON-LD document");

    // Given: A sample JSON-LD document and valid key pair
    console.log("📄 Given: Sample document and valid key pair are ready");

    // When: Signing the document with private key
    console.log("✍️  When: Signing document with private key...");
    const signedDoc = await signatureService.sign(
      sampleDocument,
      keys.privateKey,
    );
    console.log("✅ Document signed successfully");
    console.log("📝 Signed document:", JSON.stringify(signedDoc, null, 2));
    console.log(
      "🔏 JWS signature:",
      signedDoc.proof?.jws?.substring(0, 50) + "...",
    );

    // Then: Document should have proof and be verifiable
    console.log("🔍 Then: Verifying document structure...");
    expect(signedDoc.proof).toBeDefined();
    expect(signedDoc.proof.jws).toBeDefined();
    console.log("✅ Proof structure validated");

    console.log("🔐 Then: Verifying signature with public key...");
    const isValid = await signatureService.verify(signedDoc, keys.publicKey);
    console.log("🎯 Verification result:", isValid);
    expect(isValid).toBe(true);
    console.log("✅ Signature verification passed");
  });

  it("should fail verification with invalid public key", async () => {
    console.log("\n🧪 Test: should fail verification with invalid public key");

    // Given: A signed document and an invalid public key
    console.log("📄 Given: Signing document with valid private key...");
    const signedDoc = await signatureService.sign(
      sampleDocument,
      keys.privateKey,
    );
    console.log("✅ Document signed with valid key");
    console.log("📝 Signed document:", JSON.stringify(signedDoc, null, 2));

    // When: Generating a different key pair for invalid verification
    console.log("🔑 When: Generating invalid public key...");
    const { publicKey: invalidPublicKey } = keyService.generateKeyPair();
    console.log(
      "🔓 Invalid public key (first 50 chars):",
      invalidPublicKey.substring(0, 50) + "...",
    );

    // Then: Verification should fail with invalid public key
    console.log("🔍 Then: Attempting verification with invalid public key...");
    const isValid = await signatureService.verify(signedDoc, invalidPublicKey);
    console.log("🎯 Verification result:", isValid);
    console.log("❌ Expected: Verification should fail");
    expect(isValid).toBe(false);
    console.log("✅ Invalid key verification test passed");
  });
});
