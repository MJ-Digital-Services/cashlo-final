export const BRAND = {
    primary: '#3F5EF7',
    primaryDeep: '#2A43D6',
    primaryInk: '#1B2A8A',
    soft: '#E8EDFF',
    veryLight: '#F5F8FF',
    gray: '#EEF1F6',
    ink: '#0B1020',
    money: '#12B76A',
  } as const;
  
  export const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
  
  export function cn(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(' ');
  }
  
  /** Indian currency formatting: ₹1,24,500 */
  export function inr(value: number) {
    return `₹${Math.round(value).toLocaleString('en-IN')}`;
  }