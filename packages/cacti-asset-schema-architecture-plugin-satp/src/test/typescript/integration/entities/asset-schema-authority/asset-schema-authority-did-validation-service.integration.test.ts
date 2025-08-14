/*import { KeyService } from "../../../../../main/typescript/entities/asset-schema-authority/modules/services/key-service";
import { CertificateService } from "../../../../../main/typescript/entities/asset-schema-authority/modules/services/certificate-service";
import { DidDocumentService } from "../../../../../main/typescript/entities/asset-schema-authority/modules/services/did-document-service";

import fs from "fs";
import path from "path";
import os from "os";

describe("DidDocumentService", () => {
  let tmpDir: string;
  let privateKey: string;
  let publicKey: string;
  let privateKeyPath: string;
  let certPath: string;
  let didDocumentService: DidDocumentService;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "did-test-"));
    console.log(`Temporary directory created at: ${tmpDir}`);
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    console.log(`Temporary directory ${tmpDir} deleted`);
  });

  beforeEach(() => {
    // Given
    const keyService = new KeyService();
    const keyPair = keyService.generateKeyPair();
    privateKey = keyPair.privateKey;
    publicKey = keyPair.publicKey;

    privateKeyPath = path.join(tmpDir, "private.pem");
    fs.writeFileSync(privateKeyPath, privateKey);

    const certificateService = new CertificateService();
    const subject = {
      C: "US",
      ST: "NY",
      L: "New York",
      O: "Test Org",
      OU: "Test Unit",
      CN: "test.example.org",
    };
    certPath = certificateService.createSelfSignedCertificate(tmpDir, subject);

    didDocumentService = new DidDocumentService();
  });

  afterEach(() => {
    if (fs.existsSync(privateKeyPath)) fs.unlinkSync(privateKeyPath);
    if (fs.existsSync(certPath)) fs.unlinkSync(certPath);
  });

  it("should generate a valid DID Document from a self-signed certificate", async () => {
    // Given
    // When
    const didDocument =
      await didDocumentService.generateDidFromCertificate(certPath);

    // Then
    expect(didDocument.id).toMatch(/^did:jwk:/);
    expect(didDocument.verificationMethod?.[0]?.type).toBe("JsonWebKey2020");
    expect(didDocument.verificationMethod?.[0]?.publicKeyJwk).toBeDefined();
  });

  it("should generate a valid DID Document from a public key", async () => {
    // Given
    // When
    const didDocument =
      await didDocumentService.generateDidFromPublicKey(publicKey);

    // Then
    expect(didDocument.id).toMatch(/^did:jwk:/);
    expect(didDocument.verificationMethod?.[0]?.type).toBe("JsonWebKey2020");
    expect(didDocument.verificationMethod?.[0]?.publicKeyJwk).toBeDefined();
  });

  // Failing Test 1: Invalid certificate file
  it("should throw an error when given a non-PEM certificate", async () => {
    // Given
    const fakeCertPath = path.join(tmpDir, "invalid-cert.txt");
    fs.writeFileSync(fakeCertPath, "this is not a valid cert");

    // When / Then
    await expect(
      didDocumentService.generateDidFromCertificate(fakeCertPath),
    ).rejects.toThrow(/PEM/);
  });

  // Failing Test 2: Empty public key
  it("should throw an error when public key is empty", async () => {
    // Given
    const emptyPublicKey = "";

    // When / Then
    await expect(
      didDocumentService.generateDidFromPublicKey(emptyPublicKey),
    ).rejects.toThrow(/Invalid public key/);
  });

  // Failing Test 3: Malformed public key
  it("should throw an error when public key is not a PEM string", async () => {
    // Given
    const malformedKey = "not-a-valid-pem-key";

    // When / Then
    await expect(
      didDocumentService.generateDidFromPublicKey(malformedKey),
    ).rejects.toThrow(/PEM/);
  });
});
*/