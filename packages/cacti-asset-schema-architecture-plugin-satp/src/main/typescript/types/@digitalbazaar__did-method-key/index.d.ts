// types/@digitalbazaar__did-method-key/index.d.ts
declare module "@digitalbazaar/did-method-key" {
  export interface DidKeyDriverOptions {
    multibaseMultikeyHeader: string;
    fromMultibase: (options: { publicKeyMultibase: string }) => Promise<any>;
  }

  export interface FromKeyPairResult {
    didDocument: Record<string, any>;
    keyPairs: Map<string, any>;
    methodFor: (options: { purpose: string }) => any;
  }

  export interface PublicKeyToDidDocResult {
    didDocument: Record<string, any>;
  }

  export interface KeyPairToDidDocumentResult {
    didDocument: Record<string, any>;
    keyPairs: Map<string, any>;
  }

  export class DidKeyDriver {
    method: string;
    private _allowedKeyTypes: Map<string, Function>;

    constructor();

    use(options: DidKeyDriverOptions): void;

    fromKeyPair(options: {
      verificationKeyPair?: any;
      keyAgreementKeyPair?: any;
    }): Promise<FromKeyPairResult>;

    publicMethodFor(options: {
      didDocument: Record<string, any>;
      purpose: string;
    }): Record<string, any>;

    get(options: {
      did?: string;
      url?: string;
    }): Promise<Record<string, any>>;

    publicKeyToDidDoc(options: {
      publicKeyDescription: any;
    }): Promise<PublicKeyToDidDocResult>;

    computeId(options: { keyPair: any }): Promise<string>;
  }

  export function driver(): DidKeyDriver;

  export function createFromMultibase(options: {
    publicKeyMultibase: string;
  }): Promise<any>;
}
