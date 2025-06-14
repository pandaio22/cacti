import { KeyService } from "../../../../../main/typescript/entities/asset-definition-authority/modules/services/key-service";
import { CertificateService } from "../../../../../main/typescript/entities/asset-definition-authority/modules/services/certificate-service";
import { SignatureService } from "../../../../../main/typescript/entities/asset-definition-authority/modules/services/signature-service";

import fs from "fs";
import path from "path";
import os from "os";

describe("ADA Full Crypto Workflow", () => {
  let tmpDir: string;
  let privateKey: string;
  let publicKey: string;
  let privateKeyPath: string;
  let certPath: string;
  let signatureService: SignatureService;
  let sampleDocument: any;

  beforeAll(() => {
    // Runs once before all tests: setup tmp directory
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ada-test-"));
    console.log(`Temporary directory created at: ${tmpDir}`);
  });

  afterAll(() => {
    // Runs once after all tests: cleanup tmp directory
    fs.rmSync(tmpDir, { recursive: true, force: true });
    console.log(`Temporary directory ${tmpDir} deleted`);
  });

  beforeEach(() => {
    // Runs before each test: generate keys and cert
    const keyService = new KeyService();
    const keyPair = keyService.generateKeyPair();
    privateKey = keyPair.privateKey;
    publicKey = keyPair.publicKey;

    console.log("Generated Private Key:\n", privateKey);
    console.log("Generated Public Key:\n", publicKey);

    // Write private key for openssl
    privateKeyPath = path.join(tmpDir, "ada-private-key.pem");
    fs.writeFileSync(privateKeyPath, privateKey);

    // Generate self-signed certificate
    const certificateService = new CertificateService();
    const subject = {
      C: "US",
      ST: "Massachusetts",
      L: "Boston",
      O: "Asset Definition Authority",
      OU: "Root CA",
      CN: "ada-root-ca.example.org",
    };
    certPath = certificateService.createSelfSignedCertificate(tmpDir, subject);
    console.log("Certificate generated at:", certPath);

    // Create fresh service instance for each test
    signatureService = new SignatureService();

    // Fresh document for every test
    sampleDocument = {
      "@context": {
        name: "http://schema.org/name",
        age: "http://schema.org/age",
      },
      name: "John Doe",
      age: 30,
    };
  });

  afterEach(() => {
    // Clean after each test
    fs.unlinkSync(privateKeyPath);
    fs.unlinkSync(certPath);
    console.log("Cleaned up generated key and certificate files");
  });

  it("should sign and verify a valid JSON-LD document", async () => {
    // Given
    console.log("Signing document:", JSON.stringify(sampleDocument, null, 2));
    const signedDocument = await signatureService.sign(
      sampleDocument,
      privateKey,
    );
    console.log("Signed Document:\n", JSON.stringify(signedDocument, null, 2));

    // When
    const verified = await signatureService.verify(signedDocument, publicKey);
    console.log("Verification result:", verified);

    // Then
    expect(verified).toBe(true);
  });

  it("should fail verification if document is tampered", async () => {
    // Given
    const signedDocument = await signatureService.sign(
      sampleDocument,
      privateKey,
    );
    console.log(
      "Original Signed Document:\n",
      JSON.stringify(signedDocument, null, 2),
    );
    signedDocument.age = "31"; // Tampering data
    console.log(
      "Tampered Signed Document:\n",
      JSON.stringify(signedDocument, null, 2),
    );

    // When
    const verified = await signatureService.verify(signedDocument, publicKey);
    console.log("Verification result after tampering:", verified);

    // Then
    expect(verified).toBe(false);
  });

  it("should fail verification with wrong public key", async () => {
    // Given
    const signedDocument = await signatureService.sign(
      sampleDocument,
      privateKey,
    );
    console.log(
      "Signed Document with correct key:\n",
      JSON.stringify(signedDocument, null, 2),
    );

    const keyService = new KeyService();
    const otherKeyPair = keyService.generateKeyPair();
    console.log("Generated wrong public key:\n", otherKeyPair.publicKey);

    // When
    const verified = await signatureService.verify(
      signedDocument,
      otherKeyPair.publicKey,
    );
    console.log("Verification result with wrong public key:", verified);

    // Then
    expect(verified).toBe(false);
  });

  it("should fail verification when proof is missing", async () => {
    // Given
    const signedDocument = await signatureService.sign(
      sampleDocument,
      privateKey,
    );
    delete signedDocument.proof; // Remove proof
    console.log(
      "Signed Document with missing proof:\n",
      JSON.stringify(signedDocument, null, 2),
    );

    // When
    const verified = await signatureService.verify(signedDocument, publicKey);
    console.log("Verification result with missing proof:", verified);

    // Then
    expect(verified).toBe(false);
  });
});
