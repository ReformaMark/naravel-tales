import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isValidName = (name: string): boolean => {
  // Allow letters, spaces, dots, and hyphens
  return /^[a-zA-Z]+(?:[-.' ][a-zA-Z]+)*$/.test(name);
}

export const isValidPassword = (password: string): boolean => {
  // Check for at least one uppercase, one lowercase, one number, one special character, and minimum length of 8 characters
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isLongEnough = password.length >= 8;

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough;
}