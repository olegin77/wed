/**
 * Validation utilities
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationError extends Error {
  constructor(public errors: string[]) {
    super(errors.join(', '));
    this.name = 'ValidationError';
  }
}

/**
 * Email validation
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Phone number validation
 */
export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  
  if (!phone) {
    errors.push('Phone number is required');
  } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    errors.push('Invalid phone number format');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Password validation
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * URL validation
 */
export function validateUrl(url: string): ValidationResult {
  const errors: string[] = [];
  
  if (!url) {
    errors.push('URL is required');
  } else {
    try {
      new URL(url);
    } catch {
      errors.push('Invalid URL format');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Required field validation
 */
export function validateRequired(value: any, fieldName: string): ValidationResult {
  const errors: string[] = [];
  
  if (value === null || value === undefined || value === '') {
    errors.push(`${fieldName} is required`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * String length validation
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  const errors: string[] = [];
  
  if (value.length < min) {
    errors.push(`${fieldName} must be at least ${min} characters long`);
  }
  if (value.length > max) {
    errors.push(`${fieldName} must be no more than ${max} characters long`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Number range validation
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  const errors: string[] = [];
  
  if (value < min) {
    errors.push(`${fieldName} must be at least ${min}`);
  }
  if (value > max) {
    errors.push(`${fieldName} must be no more than ${max}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Combine multiple validation results
 */
export function combineValidationResults(...results: ValidationResult[]): ValidationResult {
  const allErrors = results.flatMap(result => result.errors);
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Validate object with schema
 */
export function validateObject<T>(
  obj: T,
  schema: Record<keyof T, (value: any) => ValidationResult>
): ValidationResult {
  const errors: string[] = [];
  
  // Cast Object.entries to preserve key and validator types in strict mode
  for (const [key, validator] of Object.entries(schema) as [
    keyof T,
    (value: any) => ValidationResult,
  ][]) {
    const result = validator(obj[key]);
    if (!result.isValid) {
      errors.push(...result.errors);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}