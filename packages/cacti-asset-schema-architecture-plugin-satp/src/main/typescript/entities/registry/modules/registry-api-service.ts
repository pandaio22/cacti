export class RegistryApiService {
  // This class can be extended with methods to handle asset data validation,
  // communication with external services, or any other business logic needed
  // for the registry API.

  public async commissionAsset(data: any): Promise<void> {
    this.validateAssetData(data);
  }
  private validateAssetData(data: any): void {
    if (!data["@context"]) {
      console.error("Missing @context in asset data");
      throw new Error("Missing @context in asset data");
    } else {
      console.log("Commissioning asset with data:", data);
    }
  }
}
