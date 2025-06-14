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

/**
 * CertificateService is responsible for creating self-signed certificates using OpenSSL.
 * It provides a method to generate a certificate with specified subject details and validity.
 */
export class CertificateService {
  /**
   * Creates a self-signed certificate using OpenSSL.
   * @param directory - The directory where the private key and certificate will be stored.
   * @param subject - The subject details for the certificate.
   * @param validityDays - The number of days the certificate will be valid (default is 3650).
   * @returns The path to the generated certificate file.
   */
  public createSelfSignedCertificate(
    directory: string,
    subject: CertificateSubject,
    validityDays = 3650,
  ): string {
    const privateKeyPath = path.join(directory, "ada-private-key.pem");
    const certPath = path.join(directory, "ada-certificate.pem");

    const subjectString = `/C=${subject.C}/ST=${subject.ST}/L=${subject.L}/O=${subject.O}/OU=${subject.OU}/CN=${subject.CN}`;

    try {
      execSync(
        `openssl req -new -x509 -key ${privateKeyPath} -out ${certPath} -days ${validityDays} -subj "${subjectString}"`,
      );
      return certPath;
    } catch (error) {
      console.error("Error creating self-signed certificate:", error);
      throw error;
    }
  }
}
