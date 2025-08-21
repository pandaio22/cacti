// types/@digitalbazaar__vc/index.d.ts

declare module "@digitalbazaar/vc" {
  import { documentLoader as defaultDocLoader } from "@digitalbazaar/vc/documentLoader";
  import { CredentialIssuancePurpose } from "@digitalbazaar/vc/CredentialIssuancePurpose";
  import jsigs from "jsonld-signatures";
  import jsonld from "jsonld";

  // ---------------------------------------------------------------------------
  // Core Data Types
  // ---------------------------------------------------------------------------

  export interface LinkedDataSignature {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    [key: string]: any;
  }

  export interface ProofPurpose {
    term?: string;
    controller?: string;
    [key: string]: any;
  }

  export interface Presentation {
    "@context"?: string | string[];
    type?: string[];
    verifiableCredential?: VerifiableCredential[];
    holder?: string;
    proof?: LinkedDataSignature | LinkedDataSignature[];
    [key: string]: any;
  }

  export interface VerifiableCredential {
    "@context": string | string[];
    id?: string;
    type: string[];
    issuer: string | { id: string };
    issuanceDate: string;
    expirationDate?: string;
    credentialSubject: Record<string, any>;
    proof?: LinkedDataSignature | LinkedDataSignature[];
    [key: string]: any;
  }

  export interface VerifiablePresentation extends Presentation {}

  export interface VerifyPresentationResult {
    verified: boolean;
    presentationResult: any;
    credentialResults: any[];
    error?: Error;
  }

  export interface VerifyCredentialResult {
    verified: boolean;
    results: {
      credential: VerifiableCredential;
      verified: boolean;
      error?: Error;
    }[];
    error?: Error;
  }

  // ---------------------------------------------------------------------------
  // Exports from helpers
  // ---------------------------------------------------------------------------

  export { dateRegex } from "@digitalbazaar/vc/helpers";

  export const defaultDocumentLoader: ReturnType<typeof jsigs.extendContextLoader>;

  export { CredentialIssuancePurpose };

  // ---------------------------------------------------------------------------
  // Main API
  // ---------------------------------------------------------------------------

  /**
   * Issues a verifiable credential by digitally signing it.
   *
   * @param options - Credential options.
   */
  export function issue(options: {
    credential: VerifiableCredential;
    suite: any; // Linked data signature suite
    purpose?: ProofPurpose;
    documentLoader?: typeof defaultDocLoader;
    now?: string | Date;
    maxClockSkew?: number;
  }): Promise<VerifiableCredential>;

  /**
   * Verifies a verifiable credential:
   * - Checks that the credential is well-formed.
   * - Checks the proofs (e.g., digital signatures).
   *
   * @param options - Verification options.
   */
  export function verifyCredential(options: {
    credential: VerifiableCredential;
    suite: any | any[]; // One or more LinkedDataSignature suites
    purpose?: ProofPurpose | CredentialIssuancePurpose;
    documentLoader?: typeof defaultDocLoader;
    checkStatus?: (credential: VerifiableCredential) => Promise<any>;
    now?: string | Date;
    maxClockSkew?: number;
  }): Promise<VerifyCredentialResult>;

  // ---------------------------------------------------------------------------
  // Re-export jsigs + jsonld for convenience
  // ---------------------------------------------------------------------------

  export { jsigs, jsonld };
}
