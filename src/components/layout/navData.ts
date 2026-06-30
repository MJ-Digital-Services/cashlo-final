// src/components/layout/navData.ts

export type NavLink = { label: string; href: string; icon: string };

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
      {
        label: "UPI CashPoint",
        href: "/upi-cashpoint",
        icon: "/icons/nav/cashpoint.png",
      },
    ],
  },
  {
    label: "Services",
    children: [
      {
        label: "Instant Loan",
        href: "/services/instant-loan",
        icon: "/icons/nav/instant-loan.png",
      },
      {
        label: "Recharge & Bill Payments",
        href: "/services/recharge-bills",
        icon: "/icons/nav/recharge-bills.png",
      },
      {
        label: "Travel (FASTag, NCMC)",
        href: "/services/travel",
        icon: "/icons/nav/travel.png",
      },
      {
        label: "Finance & Insurance",
        href: "/services/finance",
        icon: "/icons/nav/finance-insurance.png",
      },
      {
        label: "Entertainment (DTH, OTT)",
        href: "/services/entertainment",
        icon: "/icons/nav/entertainment.png",
      },
    ],
  },
  {
    label: "Company",
    children: [
      { label: "About Us", href: "/about", icon: "/icons/nav/about.png" },
      { label: "FAQ", href: "/faq", icon: "/icons/nav/faq.png" },
      { label: "Contact", href: "/contact", icon: "/icons/nav/contact.png" },
    ],
  },
];