export type FormErrors = Record<string, string>;

export const validators = {
  required: (v: string, label: string) => (v.trim() ? '' : `${label} is required`),
  mobile: (v: string) =>
    /^[6-9]\d{9}$/.test(v.trim()) ? '' : 'Enter a valid 10-digit mobile number',
  email: (v: string) =>
    !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address',
  pin: (v: string) => (/^[1-9]\d{5}$/.test(v.trim()) ? '' : 'Enter a valid 6-digit PIN code'),
};