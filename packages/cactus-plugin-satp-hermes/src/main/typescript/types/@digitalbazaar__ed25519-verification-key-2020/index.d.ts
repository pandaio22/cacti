// types/@digitalbazaar__ed25519-verification-key-2020/index.d.ts

declare module "@digitalbazaar/ed25519-verification-key-2020" {
  export interface Ed25519VerificationKey2020Options {
    id?: string;
    controller?: string;
    publicKeyMultibase?: string;
    privateKeyMultibase?: string;
  }

  /**
   * Verification key class for Ed25519 2020.
   *
   * Implements methods to export keys, generate fingerprints,
   * and verify fingerprints.
   */
  export class Ed25519VerificationKey2020 {
    id: string;
    type: "Ed25519VerificationKey2020";
    controller?: string;
    publicKeyMultibase: string;
    privateKeyMultibase?: string;

    constructor(options: Ed25519VerificationKey2020Options);

    /**
     * Export the key as a plain object.
     * @param options - Control which parts of the key are exported.
     */
    export(options?: {
      publicKey?: boolean;
      privateKey?: boolean;
    }): Record<string, any>;

    /**
     * Create a fingerprint for the public key.
     */
    fingerprint(): string;

    /**
     * Verify a fingerprint against this key.
     * @param options - The fingerprint to verify.
     * @returns An object with validity info.
     */
    verifyFingerprint(options: {
      fingerprint: string;
    }): { valid: boolean; error?: Error };

    /**
     * Generate a new Ed25519VerificationKey2020 instance.
     */
    static generate(options?: {
      controller?: string;
      id?: string;
    }): Promise<Ed25519VerificationKey2020>;

    /**
     * Import a key from a plain object.
     */
    static from(options: Record<string, any>): Promise<Ed25519VerificationKey2020>;
  }
}
