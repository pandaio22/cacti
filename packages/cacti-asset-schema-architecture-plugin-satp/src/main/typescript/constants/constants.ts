import fs from "fs";
import path from "path";

const privateKeyPath = path.resolve(
  process.cwd(),
  "src/main/typescript/entities/asset-definition-authority/certificates/privateKey.pem",
);
/**
 * EXPORTS
 */
const IPFS_URL: string = "http://localhost:5001/api/v0";
const PRIVATE_KEY_PEM = fs.readFileSync(privateKeyPath, "utf-8");

export { IPFS_URL, PRIVATE_KEY_PEM };
