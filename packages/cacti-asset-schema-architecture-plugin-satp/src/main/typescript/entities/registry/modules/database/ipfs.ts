/*
import { create } from "kubo-rpc-client";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { v4 as uuidv4 } from "uuid";
import {
  DefaultApi as ObjectStoreIpfsApi,
  PluginObjectStoreIpfs,
} from "@hyperledger/cactus-plugin-object-store-ipfs";

const ipfsClientOrOptions = create(); // Connects to default IPFS API
const logLevel: LogLevelDesc = "TRACE";

const pluginIpfs = new PluginObjectStoreIpfs({
  parentDir: "/" + uuidv4(), // unique root directory in IPFS to store objects
  logLevel,
  instanceId: "",
  ipfsClientOrOptions: ipfsClientOrOptions,
});

const data = "Hello IPFS via Cactus plugin!";
const dataBase64 = Buffer.from(data).toString("base64");

const response = await pluginIpfs.setObjectV1({
  key: uuidv4(),
  value: dataBase64,
});

console.log("Stored object key:", response.key);

const response = await pluginIpfs.getObjectV1({ key: yourKey });

const originalData = Buffer.from(response.data.value, "base64").toString();
console.log("Retrieved data:", originalData);
*/
