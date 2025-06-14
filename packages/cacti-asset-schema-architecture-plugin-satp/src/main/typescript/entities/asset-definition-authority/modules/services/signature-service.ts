import jsonld from "jsonld";
import { importPKCS8, SignJWT, jwtVerify, importSPKI } from "jose";

/**
 * SignatureService is responsible for signing and verifying JSON-LD objects
 * using JWS (JSON Web Signature) with ES256 algorithm.
 */
export class SignatureService {
  /**
   * Signs a JSON-LD object using a private key in PEM format.
   * @param jsonLdObject - The JSON-LD object to be signed.
   * @param privateKeyPem - The private key in PEM format used for signing.
   * @returns A promise that resolves to the signed JSON-LD object with proof.
   */
  public async sign(jsonLdObject: any, privateKeyPem: string) {
    const canon = await jsonld.canonize(jsonLdObject, {
      algorithm: "URDNA2015",
      format: "application/n-quads",
    });

    const privateKey = await importPKCS8(privateKeyPem, "ES256");

    const jws = await new SignJWT({ canon })
      .setProtectedHeader({ alg: "ES256" })
      .sign(privateKey);

    return {
      ...jsonLdObject,
      proof: {
        type: "JwsSignature2020",
        created: new Date().toISOString(),
        jws,
      },
    };
  }

  /**
   * Verifies a signed JSON-LD object against a public key.
   * @param signedObject - The signed JSON-LD object containing the proof.
   * @param publicKeyPem - The public key in PEM format used for verification.
   * @returns A promise that resolves to true if the signature is valid, false otherwise.
   */
  public async verify(
    signedObject: any,
    publicKeyPem: string,
  ): Promise<boolean> {
    const proof = signedObject.proof;
    if (!proof) return false;

    const objectToVerify = { ...signedObject };
    delete objectToVerify.proof;

    const canon = await jsonld.canonize(objectToVerify, {
      algorithm: "URDNA2015",
      format: "application/n-quads",
    });

    const publicKey = await importSPKI(publicKeyPem, "ES256");

    try {
      const { payload } = await jwtVerify(proof.jws, publicKey);
      return payload.canon === canon;
    } catch (e) {
      console.error("Verification failed:", e);
      return false;
    }
  }
}
