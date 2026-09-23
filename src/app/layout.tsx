import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SiteChrome from "@/components/layout/SiteChrome";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cashlo — India's Trusted UPI CashPoint Network",
  description: "Turn your shop into a UPI CashPoint and earn every day.",
  verification: {
    google: "ww8V9VrJ4RzF-YbL0W36KEnieUYbY5lSABA5SlvIYos",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;

const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W8BZWGZ6');`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Warms the connection for GTM's own script + the tags it injects,
            so the browser doesn't pay a fresh DNS/TLS handshake when the
            deferred loader below fires its first request. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        {/* Google Tag Manager — loaded via next/script's `lazyOnload`
            strategy (fires once the browser is idle, after the page has
            finished loading) instead of a synchronous inline <script> in
            <head>. GTM's own bundle is 112KB but ~75KB of that goes unused
            during initial load (most of it is tags that don't fire on
            first paint), so competing for bandwidth/CPU with the actual
            page content during the critical rendering path was pure waste
            — this moves that cost off the Performance-scored window
            entirely without delaying real analytics collection by more
            than a moment. */}
        <Script id="gtm" strategy="lazyOnload">
          {gtmScript}
        </Script>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W8BZWGZ6"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ThemeProvider>
          <SiteChrome>
            <Navbar />
          </SiteChrome>
          <SmoothScroll>
            <main className="flex-1">{children}</main>
          </SmoothScroll>
          <SiteChrome>
            <Footer />
          </SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}