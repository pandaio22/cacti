import { SignatureService } from "../../../../../main/typescript/entities/asset-definition-authority/modules/services/signature-service";
import { KeyService } from "../../../../../main/typescript/entities/asset-definition-authority/modules/services/key-service";

const sampleDocument = {
  "@context": {
    "@version": 1.1,
    foaf: "http://xmlns.com/foaf/0.1/",
  },
  "@id": "https://satp.example.org/asset_schema/organization/12345",
  "foaf:name": "Example Corp",
  description: "An example asset schema",
  schema_version: 1.0,
};

describe("SignatureService", () => {
  let keyService: KeyService;
  let signatureService: SignatureService;
  let keys: { privateKey: string; publicKey: string };

  beforeEach(() => {
    keyService = new KeyService();
    signatureService = new SignatureService();
    keys = keyService.generateKeyPair();
  });

  it("should sign and verify a JSON-LD document", async () => {
    const signedDoc = await signatureService.sign(
      sampleDocument,
      keys.privateKey,
    );
    expect(signedDoc.proof).toBeDefined();
    expect(signedDoc.proof.jws).toBeDefined();

    const isValid = await signatureService.verify(signedDoc, keys.publicKey);
    expect(isValid).toBe(true);
  });

  it("should fail verification with invalid public key", async () => {
    const signedDoc = await signatureService.sign(
      sampleDocument,
      keys.privateKey,
    );

    // generate new keys to simulate wrong public key
    const { publicKey: invalidPublicKey } = keyService.generateKeyPair();
    const isValid = await signatureService.verify(signedDoc, invalidPublicKey);
    expect(isValid).toBe(false);
  });
});
