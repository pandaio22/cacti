import { Ed25519Signature2020 } from "@digitalbazaar/ed25519-signature-2020";
import { driver } from "@digitalbazaar/did-method-key";
import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";
import { VerifiableCredential } from "@digitalbazaar/vc";
import { extendContextLoader } from "jsonld-signatures";
import { AssetSchemaVerifiableCredential } from "../generated/asset-schema-architecture/typescript-axios/api";
import * as vc from "@digitalbazaar/vc";

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
export async function setupCryptoSuite(
  assetVc: AssetSchemaVerifiableCredential,
): Promise<{
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
