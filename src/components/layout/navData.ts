export type NavLink = { label: string; href: string };

export type NavItem = {
  label: string;
  href?: string; // direct link (no dropdown)
  children?: NavLink[]; // dropdown items
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "UPI CashPoint",
    children: [
      { label: "UPI CashPoint", href: "/upi-cashpoint" },
    ],
  },
  {
    label: "Services",
    children: [
      { label: "Instant Loan", href: "/services/instant-loan" },
      { label: "Recharge & Bill Payments", href: "/services/recharge-bills" },
      { label: "Travel (FASTag, NCMC)", href: "/services/travel" },
      { label: "Finance & Insurance", href: "/services/finance" },
      { label: "Entertainment (DTH, OTT)", href: "/services/entertainment" },
    ],
  },
  {
    label: "Company",
    children: [
      { label: "About Us", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];