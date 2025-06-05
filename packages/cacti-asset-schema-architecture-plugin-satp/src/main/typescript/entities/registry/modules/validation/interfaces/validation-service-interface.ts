export interface IValidationService {
  /**
   * Validates asset schema data. Exported by IValidationService.
   * @param data The asset schema data to validate.
   * @returns A promise that resolves when the validation is complete.
   * @throws An error if the validation fails.
   */
  validateAssetSchema(data: any): Promise<void>;
  /**
   * Validates schema profile data. Exported by IValidationService.
   * @param data The schema profile data to validate.
   * @returns A promise that resolves when the validation is complete.
   * @throws An error if the validation fails.
   */
  validateSchemaProfile(data: any): Promise<void>;
}
