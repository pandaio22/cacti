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

  export function issue(options: {
    credential: VerifiableCredential;
    suite: any;
    purpose?: ProofPurpose;
    documentLoader?: typeof defaultDocLoader;
    now?: string | Date;
    maxClockSkew?: number;
  }): Promise<VerifiableCredential>;

  export function verifyCredential(options: {
    credential: VerifiableCredential;
    suite: any | any[];
    purpose?: ProofPurpose | CredentialIssuancePurpose;
    documentLoader?: typeof defaultDocLoader;
    checkStatus?: (credential: VerifiableCredential) => Promise<any>;
    now?: string | Date;
    maxClockSkew?: number;
  }): Promise<VerifyCredentialResult>;

  /**
   * Creates a verifiable presentation (without signing).
   */
  export function createPresentation(options: {
    verifiableCredential?: VerifiableCredential[];
    id?: string;
    holder?: string;
    [key: string]: any;
  }): Presentation;

  /**
   * Signs a verifiable presentation.
   */
  export function signPresentation(options: {
    presentation: Presentation;
    suite: any;
    purpose?: ProofPurpose;
    documentLoader?: typeof defaultDocLoader;
    challenge?: string;
    domain?: string;
    now?: string | Date;
    maxClockSkew?: number;
  }): Promise<VerifiablePresentation>;

  /**
   * Verifies a verifiable presentation (and included credentials).
   */
  export function verify(options: {
    presentation: VerifiablePresentation;
    suite: any | any[];
    purpose?: ProofPurpose;
    documentLoader?: typeof defaultDocLoader;
    challenge?: string;
    domain?: string;
    now?: string | Date;
    maxClockSkew?: number;
  }): Promise<VerifyPresentationResult>;

  // ---------------------------------------------------------------------------
  // Re-export jsigs + jsonld for convenience
  // ---------------------------------------------------------------------------

  export { jsigs, jsonld };
}
