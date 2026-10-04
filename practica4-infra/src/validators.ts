export interface UserInput {
  name: string;
  email: string;
}

export function validateUserForm(name: unknown, email: unknown): { isValid: boolean; error?: string } {
  if (typeof name !== "string" || name.trim().length === 0) {
    return { isValid: false, error: "El nombre es requerido y no puede estar vacío." };
  }

  if (typeof email !== "string" || email.trim().length === 0) {
    return { isValid: false, error: "El correo es requerido." };
  }

  // Validación básica del correo (que tenga @ y al menos un punto posterior)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: "El correo electrónico no tiene un formato válido." };
  }

  return { isValid: true };
}