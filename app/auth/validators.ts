// Validation helpers
export function validateEmail(email: string): string | null {
  if (!email.trim()) return "البريد الإلكتروني مطلوب";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "صيغة البريد غير صحيحة";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "كلمة المرور مطلوبة";
  if (password.length < 6) return "يجب أن تكون كلمة المرور 6 أحرف على الأقل";
  return null;
}

export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (password !== confirm) return "كلمات المرور غير متطابقة";
  return null;
}

export function validateName(name: string): string | null {
  if (!name.trim()) return "الاسم مطلوب";
  return null;
}

// Simulate API call
export async function simulateApiCall(delay: number = 700): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
