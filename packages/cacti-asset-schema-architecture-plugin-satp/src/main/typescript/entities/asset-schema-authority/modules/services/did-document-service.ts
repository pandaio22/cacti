import * as fs from "fs";
import * as jose from "jose";
import { execSync } from "child_process";

export class DidDocumentService {
  /**
   * Accepts a PEM file path containing either a public key or a certificate,
   * extracts the public key PEM if needed, and returns the DID and DID Document.
   * @param pemPath - Path to PEM file (public key or certificate).
   */
  public static async generateDidDocumentFromPem(pemPath: string): Promise<{
    did: string;
    didDocument: Record<string, any>;
  }> {
    const pem = fs.readFileSync(pemPath, "utf-8");

    // Check if PEM is a certificate or public key
    let publicKeyPem: string;
    if (pem.includes("BEGIN CERTIFICATE")) {
      // Extract public key PEM from certificate using OpenSSL CLI
      try {
        publicKeyPem = execSync(
          `openssl x509 -pubkey -noout -in ${pemPath}`,
        ).toString();
      } catch (error) {
        throw new Error(
          `Failed to extract public key from certificate: ${error}`,
        );
      }
    } else if (pem.includes("BEGIN PUBLIC KEY")) {
      publicKeyPem = pem;
    } else {
      throw new Error("PEM file must be a public key or certificate");
    }

    // Import public key with jose (assuming ES256 curve here, adjust if needed)
    const key = await jose.importSPKI(publicKeyPem, "ES256");

    const jwk = await jose.exportJWK(key);
    const encodedJwk = DidDocumentService.encodeJwkToDid(jwk);
    const did = `did:jwk:${encodedJwk}`;

    const didDocument = {
      "@context": "https://www.w3.org/ns/did/v1",
      id: did,
      verificationMethod: [
        {
          id: `${did}#keys-1`,
          type: "JsonWebKey2020",
          controller: did,
          publicKeyJwk: jwk,
        },
      ],
      assertionMethod: [`${did}#keys-1`],
    };

    return { did, didDocument };
  }

  private static encodeJwkToDid(jwk: any): string {
    return Buffer.from(JSON.stringify(jwk))
      .toString("base64url")
      .replace(/=/g, "");
  }
}
