import { KeyService } from "../../../../../main/typescript/entities/asset-definition-authority/modules/services/key-service";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

describe("KeyService with OpenSSL CertificateService", () => {
  const tempDir = path.join(__dirname, "temp-ada-ca");

  beforeAll(() => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up temp files if desired
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("should generate keys and issue a self-signed certificate using OpenSSL", () => {
    // Given:
    const keyService = new KeyService();
    const { privateKey, publicKey } = keyService.generateKeyPair();

    console.log("Generated Private Key:\n", privateKey);
    console.log("Generated Public Key:\n", publicKey);

    const privateKeyPath = path.join(tempDir, "privateKey.pem");
    const publicKeyPath = path.join(tempDir, "publicKey.pem");
    const certPath = path.join(tempDir, "certificate.pem");

    // Write keys to disk so OpenSSL can use them
    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(publicKeyPath, publicKey);

    console.log(`Private key written to: ${privateKeyPath}`);
    console.log(`Public key written to: ${publicKeyPath}`);

    // Build subject string for OpenSSL
    const subject =
      "/C=US/ST=Massachusetts/L=Boston/O=Asset Definition Authority/OU=Root CA/CN=ada-root-ca.example.org";

    // When:
    console.log("Generating self-signed certificate using OpenSSL...");
    // Create self-signed certificate using OpenSSL
    execSync(
      `openssl req -new -x509 -key ${privateKeyPath} -out ${certPath} -days 3650 -subj "${subject}"`,
    );

    console.log(`Certificate written to: ${certPath}`);

    // Then:
    expect(fs.existsSync(certPath)).toBe(true);
    console.log("Certificate file exists: ✅");

    // Verify certificate subject contains CN
    const certSubject = execSync(
      `openssl x509 -in ${certPath} -noout -subject`,
    ).toString();

    console.log("Certificate Subject Output from OpenSSL:\n", certSubject);

    expect(certSubject).toMatch(/CN\s*=\s*ada-root-ca\.example\.org/);
  });
});
