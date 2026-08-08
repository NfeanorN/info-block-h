/** Қазақстан номері: +7 (XXX) XXX-XX-XX */

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Телефон цифрларын маскаға айналдырады */
export function formatKzPhone(input: string): string {
  let digits = digitsOnly(input);

  // 8XXXXXXXXXX → 7XXXXXXXXXX
  if (digits.startsWith("8") && digits.length >= 1) {
    digits = `7${digits.slice(1)}`;
  }

  // егер 7 жоқ болса — қосамыз
  if (!digits.startsWith("7")) {
    digits = `7${digits}`;
  }

  digits = digits.slice(0, 11); // 7 + 10 цифр

  const rest = digits.slice(1);
  let result = "+7";

  if (rest.length === 0) return result;

  result += ` (${rest.slice(0, 3)}`;
  if (rest.length < 3) return result;
  result += ")";

  if (rest.length > 3) {
    result += ` ${rest.slice(3, 6)}`;
  }
  if (rest.length > 6) {
    result += `-${rest.slice(6, 8)}`;
  }
  if (rest.length > 8) {
    result += `-${rest.slice(8, 10)}`;
  }

  return result;
}

export function isCompleteKzPhone(value: string): boolean {
  const digits = digitsOnly(value);
  return digits.length === 11 && digits.startsWith("7");
}
