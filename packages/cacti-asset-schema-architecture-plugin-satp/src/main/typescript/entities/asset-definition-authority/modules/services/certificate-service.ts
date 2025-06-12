/*import forge from "node-forge";

export class CertificateService {
  public createSelfSignedCertificate(subjectAttrs: any, keys: { privateKey: string, publicKey: string }, validityDays: number = 3650): string {
    const pki = forge.pki;

    const cert = pki.createCertificate();
    cert.publicKey = pki.publicKeyFromPem(keys.publicKey);
    cert.serialNumber = this.generateSerialNumber();
    
    const now = new Date();
    cert.validity.notBefore = now;
    cert.validity.notAfter = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000);

    cert.setSubject(subjectAttrs);
    cert.setIssuer(subjectAttrs);

    cert.setExtensions([
      { name: "basicConstraints", cA: true },
      { name: "keyUsage", keyCertSign: true, digitalSignature: true, cRLSign: true },
      { name: "subjectKeyIdentifier" },
    ]);

    cert.sign(pki.privateKeyFromPem(keys.privateKey), forge.md.sha256.create());
    
    return pki.certificateToPem(cert);
  }

  private generateSerialNumber(): string {
    return Math.floor(Math.random() * 1e16).toString(16);
  }
}
*/
