import type { ContactFormValues } from "@/types";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = {
  name: { min: 2, max: 80 },
  message: { min: 20, max: 4000 },
};

export type ValidationErrors = Partial<Record<keyof ContactFormValues, string>>;

/** Shared validation used by the API route (the form mirrors these rules). */
export function validateContact(input: Partial<ContactFormValues>): ValidationErrors {
  const errors: ValidationErrors = {};
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const message = input.message?.trim() ?? "";

  if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) errors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";
  if (!input.projectType?.trim()) errors.projectType = "Please choose a project type.";
  if (message.length < LIMITS.message.min || message.length > LIMITS.message.max)
    errors.message = `Message should be between ${LIMITS.message.min} and ${LIMITS.message.max} characters.`;
  return errors;
}
