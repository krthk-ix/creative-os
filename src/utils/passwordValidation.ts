export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

export const passwordRequirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters',
    test: (password: string) => password.length >= 8,
  },
  {
    label: 'One uppercase letter',
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: 'One lowercase letter',
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: 'One number',
    test: (password: string) => /\d/.test(password),
  },
  {
    label: 'One special character (!@#$%^&*)',
    test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

export function validatePassword(password: string): { isValid: boolean; failedRequirements: string[] } {
  const failedRequirements = passwordRequirements
    .filter(req => !req.test(password))
    .map(req => req.label);

  return {
    isValid: failedRequirements.length === 0,
    failedRequirements,
  };
}

export function getPasswordStrength(password: string): { strength: number; label: string; color: string } {
  const passed = passwordRequirements.filter(req => req.test(password)).length;
  const percentage = (passed / passwordRequirements.length) * 100;

  if (percentage === 100) {
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  } else if (percentage >= 60) {
    return { strength: percentage, label: 'Medium', color: 'bg-yellow-500' };
  } else {
    return { strength: percentage, label: 'Weak', color: 'bg-red-500' };
  }
}
