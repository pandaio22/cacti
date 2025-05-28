import { IPFSRemoteLogRepository } from "../../../../main/typescript/entities/registry/modules/database/database-ipfs";
import { RemoteLog } from "../../../../main/typescript/entities/registry/modules/database/database-types";


async function main() {
  const ipfsApiBaseUrl = "http://localhost:5001/api/v0";
  const repo = new IPFSRemoteLogRepository(ipfsApiBaseUrl);

  const log: RemoteLog = {
    key: "log-123",
    hash: "This is a test log stored on IPFS",
    signature: "test-signature",
    signerPubKey: "test-signer-pubkey",
  };

  await repo.create(log);
  const fetchedLog = await repo.readById(log.key);
  return { stored: log, fetched: fetchedLog };
}

describe("IPFSRemoteLogRepository integration (no mocks)", () => {
  it("stores and fetches a log via real IPFS node", async () => {
    const { stored, fetched } = await main();

    expect(fetched).toBeDefined();
    expect(fetched.key).toEqual(stored.key);
    expect(fetched.hash).toEqual(stored.hash);
  }, 10000); // increased timeout for network calls
});
