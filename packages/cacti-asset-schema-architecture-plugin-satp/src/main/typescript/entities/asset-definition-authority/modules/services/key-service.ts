import { generateKeyPairSync } from "crypto";

export class KeyService {
  public generateKeyPair(): { privateKey: string; publicKey: string } {
    const { publicKey, privateKey } = generateKeyPairSync("ec", {
      namedCurve: "P-256", // Can use 'secp384r1' or RSA if you prefer
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    return { privateKey, publicKey };
  }
}
