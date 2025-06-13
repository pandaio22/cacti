import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface CertificateSubject {
  C: string;
  ST: string;
  L: string;
  O: string;
  OU: string;
  CN: string;
}

export class CertificateService {
  public createSelfSignedCertificate(
    directory: string,
    subject: CertificateSubject,
    validityDays = 3650,
  ): string {
    const privateKeyPath = path.join(directory, "ada-private-key.pem");
    const certPath = path.join(directory, "ada-certificate.pem");

    const subjectString = `/C=${subject.C}/ST=${subject.ST}/L=${subject.L}/O=${subject.O}/OU=${subject.OU}/CN=${subject.CN}`;

    execSync(
      `openssl req -new -x509 -key ${privateKeyPath} -out ${certPath} -days ${validityDays} -subj "${subjectString}"`,
    );

    return certPath;
  }
}
