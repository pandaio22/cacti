import { IPFS_URL } from "../../constants";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export class DatabaseIpfsConnector {
  private ipfsApiUrl = IPFS_URL;

  public async getFileFromIpfs(cid: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.ipfsApiUrl}/cat?arg=${cid}`,
        null,
        {
          responseType: "arraybuffer",
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        },
      );
      // Convert the response data (Buffer) to a JSON object
      const jsonData = JSON.parse(response.data.toString("utf8"));
      console.log("IPFS get response:", jsonData);
      return jsonData; // Return the JSON object
    } catch (error: any) {
      console.error("Error retrieving file from IPFS:", error.message || error);
      throw error;
    }
  }
  /**
   * Adds JSON data to the local IPFS node and returns the resulting CID.
   * @param jsonData The JSON object to be added to IPFS.
   * @returns The CID string of the added JSON data.
   */
  public async addFileToIpfs(jsonData: any): Promise<string> {
    const form = new FormData();

    // Convert JSON object to string and create a buffer
    const jsonString = JSON.stringify(jsonData, null, 2);
    const jsonBuffer = Buffer.from(jsonString, "utf8");

    // Append the JSON buffer as a file to the form
    form.append("file", jsonBuffer, {
      filename: "data.json",
      contentType: "application/ld+json",
    });

    try {
      const response = await axios.post(`${this.ipfsApiUrl}/add`, form, {
        headers: {
          ...form.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      // The response data typically includes the hash (CID), like: { Name, Hash, Size }
      console.log("IPFS add response:", response.data);
      return this.cidToDid(response.data.Hash); // The CID of the added file
    } catch (error: any) {
      console.error("Error adding JSON to IPFS:", error.message || error);
      throw error;
    }
  }
  /**
   * Retrieves a file from the local IPFS node using its CID.
   * @param cid The CID of the file to be retrieved.
   * @returns The JSON object retrieved from IPFS.
   */
  public cidToDid(cid: string): string {
    return `did:ipfs:${cid}`;
  }
}
