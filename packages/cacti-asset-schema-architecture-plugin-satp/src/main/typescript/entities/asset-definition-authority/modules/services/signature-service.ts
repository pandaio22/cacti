import jsonld from "jsonld";
import { importPKCS8, SignJWT, jwtVerify, importSPKI } from "jose";

export class SignatureService {
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
