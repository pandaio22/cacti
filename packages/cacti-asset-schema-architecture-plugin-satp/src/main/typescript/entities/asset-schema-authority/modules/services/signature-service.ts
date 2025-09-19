import jsonld from "jsonld";
import { JsonLdDocument } from "jsonld";
import { importPKCS8, CompactSign, importSPKI, flattenedVerify } from "jose";
import * as crypto from "crypto";

export class SignatureService {
  /**
   * Signs a JSON-LD object using Linked Data Proofs (JwsSignature2020).
   * W3C compliant implementation.
   * DISCLAIMER - IT REQUIRES VALID IRI's to resolve
   * @param jsonLdObject - The JSON-LD object to sign.
   * @param privateKeyPem - The private key in PEM format used for signing.
   * @param verificationMethod - The verification method URL or identifier.
   * @returns {Promise<any>} - Returns the signed JSON-LD object with proof.
   * @throws {Error} - Throws an error if signing fails.
   */
  public async sign(
    jsonLdObject: any,
    privateKeyPem: string,
    verificationMethod: string = "URL-to-public-key",
  ) {
    try {
      // Step 1: Create proof configuration
      const proofConfig = {
        type: "JwsSignature2020",
        created: new Date().toISOString(),
        proofPurpose: "assertionMethod",
        verificationMethod: verificationMethod,
      };

      // Step 2: Expand and Canonicalize the document
      //const doc = { name: "John Doe" };
      //const context = { "@base": "https://json-ld.org/contexts/person.jsonld" };
      //const compacted = await jsonld.compact(doc, context);
      console.log(JSON.stringify(jsonLdObject, null, 2));

      const expanded = await jsonld.expand(jsonLdObject);
      console.log(expanded);
      const canon = await jsonld.canonize(expanded, {
        algorithm: "URDNA2015",
        format: "application/n-quads",
      });

      // Step 3: Create hash of canonicalized document
      const canonHash = crypto
        .createHash("sha256")
        .update(canon, "utf8")
        .digest();

      // Step 4: Sign the hash
      const privateKey = await importPKCS8(privateKeyPem, "ES256");

      // Create JWS with detached payload (W3C spec compliant)
      const jws = await new CompactSign(canonHash)
        .setProtectedHeader({
          alg: "ES256",
          b64: false,
          crit: ["b64"],
        })
        .sign(privateKey);

      // Step 5: Return document with complete proof
      return {
        ...jsonLdObject,
        proof: {
          ...proofConfig,
          jws: jws,
        },
      };
    } catch (error) {
      console.error("Error while signing JSON-LD document:", error);
      throw error;
    }
  }

  /**
   * Verifies a signed JSON-LD object using Linked Data Proofs (JwsSignature2020).
   * W3C compliant implementation.
   * @param signedObject - The signed JSON-LD object containing the proof.
   * @param publicKeyPem - The public key in PEM format used for verification.
   * @returns {Promise<boolean>} - Returns true if verification is successful, false otherwise.
   * @throws {Error} - Throws an error if verification fails.
   */
  public async verify(
    signedObject: any,
    publicKeyPem: string,
  ): Promise<boolean> {
    try {
      const proof = signedObject.proof;
      if (!proof || !proof.jws) {
        console.error("No proof or JWS found");
        return false;
      }

      // Step 1: Extract proof configuration (without jws)
      const proofConfig = { ...proof };
      delete proofConfig.jws;

      // Step 2: Recreate the document that was signed
      const objectToVerify = {
        ...signedObject,
      };
      delete objectToVerify.proof; // Ensure jws is not included

      // Step 3: Canonicalize the document
      const canon = await jsonld.canonize(objectToVerify, {
        algorithm: "URDNA2015",
        format: "application/n-quads",
      });
      // Step 4: Create hash of canonicalized document
      const canonHash = crypto
        .createHash("sha256")
        .update(canon, "utf8")
        .digest();

      // Step 5: Flatten the JWS for verification
      const [encodedProtectedHeader, , encodedSignature] = proof.jws.split(".");
      const flattenedJws = {
        protected: encodedProtectedHeader,
        payload: canonHash,
        signature: encodedSignature,
      };

      // Step 6: Verify the signature
      const publicKey = await importSPKI(publicKeyPem, "ES256");

      const { protectedHeader } = await flattenedVerify(
        flattenedJws,
        publicKey,
        {
          algorithms: ["ES256"],
        },
      );

      // Step 6: Validate protected header compliance
      if (
        !protectedHeader ||
        protectedHeader.alg !== "ES256" ||
        protectedHeader.b64 !== false ||
        !protectedHeader.crit?.includes("b64")
      ) {
        console.error("Invalid protected header for W3C compliance");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Verification failed:", error);
      return false;
    }
  }
}
