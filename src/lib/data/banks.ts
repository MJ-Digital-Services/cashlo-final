export interface BankInfo {
    name: string;
    slug: string;
    logo: string;
  }
  
  export const banks: BankInfo[] = [
    { name: "HDFC Bank", slug: "hdfc-bank-emi-calculator", logo: "/logos/hdfc.svg" },
    { name: "SBI", slug: "sbi-emi-calculator", logo: "/logos/sbi.svg" },
    { name: "ICICI Bank", slug: "icici-bank-emi-calculator", logo: "/logos/icici.svg" },
    { name: "Axis Bank", slug: "axis-bank-emi-calculator", logo: "/logos/axis.svg" },
    { name: "Kotak Mahindra Bank", slug: "kotak-mahindra-bank-emi-calculator", logo: "/logos/kotak.svg" },
    { name: "Bank of Baroda", slug: "bank-of-baroda-emi-calculator", logo: "/logos/bob.svg" },
    { name: "Punjab National Bank", slug: "punjab-national-bank-emi-calculator", logo: "/logos/pnb.svg" },
    { name: "Canara Bank", slug: "canara-bank-emi-calculator", logo: "/logos/canara.svg" },
    { name: "IndusInd Bank", slug: "indusind-bank-emi-calculator", logo: "/logos/indusind.svg" },
    { name: "Tata Capital", slug: "tata-capital-emi-calculator", logo: "/logos/tata.jpg" },
  ];
  
  export function getBankBySlug(slug: string): BankInfo | undefined {
    return banks.find((b) => b.slug === slug);
  }