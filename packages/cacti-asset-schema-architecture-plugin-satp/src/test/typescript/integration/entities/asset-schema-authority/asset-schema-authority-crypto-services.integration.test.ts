/*import { KeyService } from "../../../../../main/typescript/entities/asset-definition-authority/modules/services/key-service";
import { CertificateService } from "../../../../../main/typescript/entities/asset-definition-authority/modules/services/certificate-service";
import { SignatureService } from "../../../../../main/typescript/entities/asset-definition-authority/modules/services/signature-service";

const sampleDocument = {
  "@context": {
    "@version": 1.1,
    schema_version: {
      "@id": "https://schema.org/schemaVersion",
      "@type": "@id",
    },
    foaf: "http://xmlns.com/foaf/0.1/",
  },
  "@id": "https://satp.example.org/asset_schema/organization/12345",
  "foaf:name": "Example Corp",
  description: "An example asset schema for an organization",
  schema_version: 1.0,
};

describe("ADA full workflow", () => {
  it("generates keys, cert and signs a JSON-LD document", async () => {
    const keyService = new KeyService();
    const { privateKey, publicKey } = keyService.generateKeyPair();

    const certificateService = new CertificateService();
    const subject =
      "/C=US/ST=Massachusetts/L=Boston/O=Asset Definition Authority/OU=Root CA/CN=ada-root-ca.example.org";
    const certPem = certificateService.createSelfSignedCertificate(
      privateKey,
      subject,
    );
    console.log("Certificate PEM:", certPem);

    const signatureService = new SignatureService();
    const signedDoc = await signatureService.sign(sampleDocument, privateKey);
    console.log("Signed Document:", signedDoc);

    const verified = await signatureService.verify(signedDoc, publicKey);
    console.log("Verification Result:", verified);
    expect(verified).toBe(true);
  });
});
*/