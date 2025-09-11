// types/ed25519-signature-2020/index.d.ts
declare module "@digitalbazaar/ed25519-signature-2020" {
  import { LinkedDataSignature } from "jsonld-signatures";
  import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";

  export interface Signer {
    sign: (options: { data: Uint8Array }) => Promise<Uint8Array>;
  }

  export interface Verifier {
    verify: (options: { data: Uint8Array; signature: Uint8Array }) => Promise<boolean>;
  }

  export interface Ed25519Signature2020Options {
    key?: Ed25519VerificationKey2020;
    signer?: Signer;
    verifier?: Verifier;
    proof?: Record<string, any>;
    date?: string | Date;
    useNativeCanonize?: boolean;
    canonizeOptions?: Record<string, any>;
  }

  export interface Proof {
    proofValue?: string;
    verificationMethod?: string | Record<string, any>;
    [x: string]: any;
  }

  export class Ed25519Signature2020 extends LinkedDataSignature {
    requiredKeyType: string;

    constructor(options?: Ed25519Signature2020Options);

    sign(options: { verifyData: Uint8Array; proof: Proof }): Promise<Proof>;
    verifySignature(options: {
      verifyData: Uint8Array;
      verificationMethod: any;
      proof: Proof;
    }): Promise<boolean>;
    assertVerificationMethod(options: { verificationMethod: any }): Promise<void>;
    getVerificationMethod(options: {
      proof: Proof;
      documentLoader: (url: string) => Promise<{ document: any }>;
    }): Promise<any>;
    matchProof(options: {
      proof: Proof;
      document: any;
      purpose: any;
      documentLoader: (url: string) => Promise<{ document: any }>;
    }): Promise<boolean>;

    static CONTEXT_URL: string;
    static CONTEXT: any;
  }

  export const suiteContext: typeof suiteContext;
}
