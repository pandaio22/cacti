import { Ed25519Signature2020 } from "@digitalbazaar/ed25519-signature-2020";
import { driver } from "@digitalbazaar/did-method-key";
import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";
import { VerifiableCredential } from "@digitalbazaar/vc";
import { extendContextLoader } from "jsonld-signatures";
import {
  AssetSchemaVerifiableCredential,
  SchemaProfileVerifiableCredential,
} from "../generated/asset-schema-architecture/typescript-axios/api";
import * as vc from "@digitalbazaar/vc";
import { canonize } from "jsonld";
import crypto from "crypto";

/**
 * Compute a stable SHA-256 hash of a JSON-LD object.
 * Canonicalizes the document using URDNA2015 to ensure consistent hashes.
 *
 * @param jsonldDoc - The JSON-LD object to hash.
 * @param nonce - Unique number (optional)
 * @returns SHA-256 hash as a hex string.
 */
export async function hashJsonLd(
  jsonLd: Record<string, any>,
  nonce?: string,
  documentLoader?: any,
): Promise<string> {
  try {
    if (!jsonLd["@context"]) {
      throw new Error(
        "JSON-LD document must have an @context to compute a stable hash.",
      );
    }
    if (!documentLoader) {
      console.debug(
        "No custom document loader. Dereferencing remote contexts...\n",
      );
    }

    // Clone the object to avoid mutating the original
    const docToHash = { ...jsonLd };

    if (nonce) {
      docToHash.nonce = nonce;
    }

    // Canonicalize JSON-LD to N-Quads using URDNA2015
    const nquads = await canonize(docToHash, {
      algorithm: "URDNA2015",
      format: "application/n-quads",
      documentLoader: documentLoader ? documentLoader : undefined,
    });

    // Compute SHA-256 hash of canonicalized N-Quads
    const hash = crypto.createHash("sha256").update(nquads).digest("hex");

    return hash;
  } catch (error: any) {
    console.error("Failed to hash JSON-LD:", error);
    throw new Error(`Failed to hash JSON-LD: ${error.message || error}`);
  }
}

/**
 * Verify that the hash inside a VC matches the JSON-LD content of the assetSchema.
 * @param vc - The AssetSchemaVerifiableCredential to verify
 * @param assetSchema - The original JSON-LD of the Asset Schema
 * @returns true if the hash is valid, false otherwise
 */
export async function verifyJsonLdHash(
  vc: any,
  schema: Record<string, any>,
  documentLoader?: any,
): Promise<boolean> {
  try {
    if (!vc.credentialSubject?.hash) {
      throw new Error("VC does not contain a hash in credentialSubject");
    }

    // Extract nonce if present
    const nonce = vc.credentialSubject.nonce;

    // Compute the hash over the JSON-LD and nonce
    const computedHash = await hashJsonLd(schema, nonce, documentLoader);

    // Compare with VC's hash
    return computedHash === vc.credentialSubject.hash;
  } catch (err: any) {
    console.error("Failed to verify VC hash:", err);
    return false;
  }
}

/**
 * Generate a cryptographically secure random nonce as a hex string.
 * @param length - Length of the nonce in bytes (default 16)
 */
export function generateNonce(length = 16): string {
  const array = new Uint8Array(length);
  crypto.webcrypto.getRandomValues(array);
  return Buffer.from(array).toString("hex");
}

/**
 * Normalize the @context property of a VC so it's always compatible
 * with @digitalbazaar/vc expectations (string | string[]).
 */
export function normalizeCredential<T extends Record<string, any>>(
  credential: T,
): any {
  let ctx = credential["@context"];

  if (!ctx) {
    // Default VC base context
    ctx = "https://www.w3.org/2018/credentials/v1";
  } else if (typeof ctx === "object" && !Array.isArray(ctx)) {
    // Wrap plain object inside array
    ctx = ["https://www.w3.org/2018/credentials/v1", ctx];
  } else if (Array.isArray(ctx)) {
    // Ensure only strings in the array
    ctx = ctx.map((c) => (typeof c === "string" ? c : JSON.stringify(c)));
  }

  // First cast to unknown to satisfy TS, then to VerifiableCredential
  return {
    ...credential,
    "@context": ctx,
  } as unknown as VerifiableCredential;
}

/**
 * Prepare a suite for verifying a VC.
 */
export async function setupCryptoSuite(assetVc: any): Promise<{
  suite: Ed25519Signature2020;
}> {
  if (!assetVc.proof?.verificationMethod) {
    throw new Error("Verification method missing in VC proof");
  }

  const keyId = assetVc.proof.verificationMethod;

  // Initialize DID key driver
  const didKeyDriverInstance = driver();
  didKeyDriverInstance.use({
    multibaseMultikeyHeader: "z6Mk",
    fromMultibase: Ed25519VerificationKey2020.from,
  });

  // Load DID Document and extract key
  const didDoc = await didKeyDriverInstance.get({ did: keyId.split("#")[0] });

  const key = didDoc.verificationMethod?.find((vm: any) => {
    const fragment = keyId.split("did:key:").pop() || "";
    const result = vm.id.endsWith(fragment);

    console.debug("Checking vm.id:", vm.id);
    console.debug("  keyId:", keyId);
    console.debug("  keyId fragment:", fragment);
    console.debug("  endsWith result:", result);

    return result;
  });
  console.log("Matched key:", key);

  if (!key) throw new Error("Key not found in DID Document");

  // Create suite
  const publicKey = await Ed25519VerificationKey2020.from(key);
  console.debug("Public Key:\n", publicKey);

  const suite = new Ed25519Signature2020({
    key: publicKey,
  });
  console.debug("Cryptosuite:\n", suite);

  return { suite };
}

/**
 * Prepare a document loader for verifying a VC.
 * Handles local contexts, did:key resolution, and optional fallback loader.
 */
export async function setupLoader(localContexts?: Map<string, any>): Promise<{
  loader: (url: string) => Promise<any>;
}> {
  // Initialize DID key driver
  const didKeyDriverInstance = driver();
  didKeyDriverInstance.use({
    multibaseMultikeyHeader: "z6Mk",
    fromMultibase: Ed25519VerificationKey2020.from,
  });

  // Create loader
  const loader = extendContextLoader(async (url: string) => {
    if (!url) throw new Error("documentLoader called with undefined URL");

    if (localContexts?.has(url)) {
      return {
        contextUrl: null,
        documentUrl: url,
        document: localContexts.get(url),
        tag: "local",
      };
    }

    if (url.startsWith("did:key:")) {
      const doc = await didKeyDriverInstance.get({ did: url });
      return { contextUrl: null, documentUrl: url, document: doc };
    }

    // fallback to provided loader or default VC loader
    return vc.defaultDocumentLoader(url);
  });

  return { loader };
}

/**
 * DEAD CODE
 */
export async function prepareSuiteAndLoader(
  vc: AssetSchemaVerifiableCredential,
  localContexts?: Map<string, any>,
): Promise<{
  suite: Ed25519Signature2020;
  loader: (url: string) => Promise<any>;
}> {
  if (!vc.proof?.verificationMethod) {
    throw new Error("Verification method missing in VC proof");
  }

  const keyId = vc.proof.verificationMethod;

  // Initialize DID key driver
  const didKeyDriverInstance = driver();
  didKeyDriverInstance.use({
    multibaseMultikeyHeader: "z6Mk",
    fromMultibase: Ed25519VerificationKey2020.from,
  });

  // Load DID Document and extract key
  const didDoc = await didKeyDriverInstance.get({ did: keyId.split("#")[0] });
  //const key = didDoc.verificationMethod?.find((vm: any) => vm.id === keyId);
  //const key = didDoc.verificationMethod?.find((vm: any) =>
  //  vm.id.endsWith(keyId.split("#").pop() || ""),
  //);
  const key = didDoc.verificationMethod?.find((vm: any) => {
    //const fragment = keyId.includes("#") ? keyId.split("#").pop()! : keyId;
    const fragment = keyId.split("did:key:").pop() || "";
    const result = vm.id.endsWith(fragment);

    console.debug("Checking vm.id:", vm.id);
    console.debug("  keyId:", keyId);
    console.debug("  keyId fragment:", fragment);
    console.debug("  endsWith result:", result);

    return result;
  });

  console.log("Matched key:", key);

  if (!key) throw new Error("Key not found in DID Document");

  // Create suite
  const publicKey = await Ed25519VerificationKey2020.from(key);
  console.debug("Public Key:\n", publicKey);

  const suite = new Ed25519Signature2020({
    key: publicKey,
  });
  console.debug("Cryptosuite:\n", suite);

  // Create loader
  const loader = extendContextLoader(async (url: string) => {
    if (!url) throw new Error("documentLoader called with undefined URL");

    if (localContexts?.has(url)) {
      return {
        contextUrl: null,
        documentUrl: url,
        document: localContexts.get(url),
        tag: "local",
      };
    }

    if (url.startsWith("did:key:")) {
      const doc = await didKeyDriverInstance.get({ did: url });
      return { contextUrl: null, documentUrl: url, document: doc };
    }

    // fallback to provided loader or default VC loader
    return vc.defaultDocumentLoader(url);
  });

  return { suite, loader };
}
