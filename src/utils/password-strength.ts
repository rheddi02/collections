// Password strength checker utility functions

export const getPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 6) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

export const getPasswordStrengthLabel = (strength: number) => {
  switch (strength) {
    case 0:
    case 1:
      return { label: "Very Weak", color: "text-red-500" };
    case 2:
      return { label: "Weak", color: "text-orange-500" };
    case 3:
      return { label: "Fair", color: "text-yellow-500" };
    case 4:
      return { label: "Good", color: "text-blue-500" };
    case 5:
      return { label: "Strong", color: "text-green-500" };
    default:
      return { label: "", color: "" };
  }
};
