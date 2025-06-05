export interface IValidationService {
  validateAssetSchema(data: any): Promise<void>;
  validateSchemaProfile(data: any): Promise<void>;
}
