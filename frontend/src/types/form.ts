import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

/**
 * Form-related type definitions
 */

export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface FormFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  error?: string | FieldError; // FieldError from react hook form - is a string or an object with message and type on each field
  register?: UseFormRegisterReturn; // react-hook-form register function return type
}
