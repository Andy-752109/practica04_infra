import { describe, it, expect } from "vitest";
import { validateUserForm } from "../src/validator";

describe("validateUserForm", () => {
  it("debe retornar isValid: true para datos correctos", () => {
    const result = validateUserForm("Andrea Arevalo", "andrea@iteso.mx");
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("debe fallar si el nombre está vacío", () => {
    const result = validateUserForm("", "andrea@iteso.mx");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("nombre es requerido");
  });

  it("debe fallar si el correo no tiene formato válido", () => {
    const result = validateUserForm("Andrea", "correo_sin_arroba.com");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("formato válido");
  });

  it("debe fallar si los tipos no son cadenas de texto", () => {
    const result = validateUserForm(null, 12345);
    expect(result.isValid).toBe(false);
  });
});