'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { EASE } from './shared/tokens';
import { Button } from './shared/Button';

export default function StickyMobileCta({ onBecomeMerchant }: { onBecomeMerchant: () => void }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ y: visible ? 0 : 120, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/60 bg-white/85 px-4 py-3 backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-[#0B1020]/90"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex gap-2.5">
        <Button className="flex-1" onClick={onBecomeMerchant}>
          Become merchant
        </Button>
        <a
          href="https://play.google.com/store"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-[15px] font-semibold text-[#0B1020] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] dark:border-white/15 dark:bg-white/[0.06] dark:text-white"
        >
          <Download className="h-4 w-4" aria-hidden />
          Download app
        </a>
      </div>
    </motion.div>
  );
}