import { ValidationErrorType } from "./validation-error.type";

export interface ValidationErrorDetail {
  type: ValidationErrorType;
  message: string;
}
