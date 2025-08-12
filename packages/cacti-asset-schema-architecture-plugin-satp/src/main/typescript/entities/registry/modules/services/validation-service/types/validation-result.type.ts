/**
 * Validation Result Type
 * This type defines the structure of the validation result returned by various validation services.
 * It includes information about whether the input was valid, any errors or warnings encountered,
 * and optional details for further context.
 */
export interface ValidationResult {
  valid: boolean; // Was the input valid?
  errors?: string[]; // Optional list of validation errors
  warnings?: string[]; // Optional non-critical issues
  details?: any; // Optional structured info (e.g., JSON-LD expansion)
}
