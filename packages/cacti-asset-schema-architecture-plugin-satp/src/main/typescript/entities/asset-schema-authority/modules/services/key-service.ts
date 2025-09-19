import { generateKeyPairSync } from "crypto";

/**
 * KeyService is responsible for generating cryptographic key pairs.
 * It uses the Node.js crypto module to generate EC (Elliptic Curve) keys.
 * The generated keys are in PEM format, suitable for secure communications.
 */
export class KeyService {
  /**
   * Generates a new EC key pair (private and public keys).
   * The keys are generated using the P-256 curve.
   * @returns An object containing the private and public keys in PEM format.
   */
  public generateKeyPair(): { privateKey: string; publicKey: string } {
    try {
      const { publicKey, privateKey } = generateKeyPairSync("ec", {
        namedCurve: "P-256", // Can use 'secp384r1' or RSA if you prefer
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
      });

      return { privateKey, publicKey };
    } catch (error) {
      console.error("Error generating key pair:", error);
      throw error;
    }
  }
}
