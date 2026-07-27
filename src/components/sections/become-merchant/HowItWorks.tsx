'use client';

import * as React from 'react';
import { motion, useInView, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { Download, FileCheck2, IndianRupee, ScanFace, UserPlus } from 'lucide-react';
import { cn, EASE } from './shared/tokens';
import { SectionHeader } from './shared/SectionHeader';

const STEPS = [
  {
    icon: Download,
    title: 'Download the app',
    body: 'Install Cashlo from the Play Store on the phone you already use at the shop.',
    meta: '2 minutes',
  },
  {
    icon: UserPlus,
    title: 'Register your shop',
    body: 'Enter your name, shop name and mobile number. Verify with an OTP.',
    meta: '3 minutes',
  },
  {
    icon: ScanFace,
    title: 'Complete KYC',
    body: 'Upload Aadhaar, PAN and a shop photo straight from your camera.',
    meta: '5 minutes',
  },
  {
    icon: FileCheck2,
    title: 'Get verified',
    body: 'Our team checks your documents and activates your merchant account.',
    meta: 'Within 48 hours',
  },
  {
    icon: IndianRupee,
    title: 'Start earning',
    body: 'Print your QR, switch on services and take your first transaction the same day.',
    meta: 'Day one',
  },
];

/**
 * One step. Reports back when it crosses the middle of the viewport so the
 * parent can track which step is current; steps already passed stay lit.
 */
function TimelineStep({
  step,
  index,
  state,
  onEnter,
}: {
  step: (typeof STEPS)[number];
  index: number;
  state: 'past' | 'current' | 'future';
  onEnter: (i: number) => void;
}) {
  const ref = React.useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  // Narrow band across the middle of the screen: whichever step is in it, is current.
  const inBand = useInView(ref, { margin: '-45% 0px -45% 0px' });
  const Icon = step.icon;

  React.useEffect(() => {
    if (inBand) onEnter(index);
  }, [inBand, index, onEnter]);

  const lit = state !== 'future';

  return (
    <li ref={ref} className="relative pb-9 pl-[68px] last:pb-0 sm:pl-[76px]">
      <motion.span
        animate={
          reduce
            ? undefined
            : {
                scale: state === 'current' ? 1.06 : 1,
                borderColor: state === 'current' ? 'rgba(63,94,247,0.55)' : 'rgba(255,255,255,0.7)',
              }
        }
        transition={{ duration: 0.45, ease: EASE }}
        className={cn(
          'absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-2xl border bg-white transition-[background-color,color,box-shadow] duration-500 sm:h-16 sm:w-16 dark:bg-[#101733]',
          state === 'current'
            ? 'text-white shadow-[0_18px_40px_-16px_rgba(63,94,247,0.85)]'
            : lit
              ? 'text-[#3F5EF7] shadow-[0_14px_34px_-20px_rgba(63,94,247,0.6)]'
              : 'text-slate-300 shadow-none dark:text-white/25',
        )}
      >
        {/* the fill is a layer, so the icon colour can cross-fade cleanly */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ opacity: state === 'current' ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#3F5EF7] to-[#2A43D6]"
        />
        <motion.span
          animate={reduce ? undefined : { rotate: state === 'current' ? [0, -8, 0] : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative"
        >
          <Icon className="h-6 w-6" aria-hidden />
        </motion.span>
      </motion.span>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-90px' }}
        transition={{ duration: 0.55, ease: EASE }}
        className="pt-1.5"
      >
        <motion.div
          animate={{ opacity: lit ? 1 : 0.42 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <span
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-500',
              lit ? 'text-[#3F5EF7]' : 'text-slate-400',
            )}
          >
            Step {index + 1} · {step.meta}
          </span>
          <h3 className="mt-1.5 text-xl font-bold tracking-tight text-[#0B1020] dark:text-white">
            {step.title}
          </h3>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {step.body}
          </p>
        </motion.div>
      </motion.div>
    </li>
  );
}

export default function HowItWorks() {
  const reduce = useReducedMotion();
  const listRef = React.useRef<HTMLOListElement>(null);
  const [active, setActive] = React.useState(0);

  // Steps never un-light: once you have passed one, it stays part of your progress.
  const handleEnter = React.useCallback((i: number) => {
    setActive((prev) => (i > prev ? i : prev));
  }, []);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 80%', 'end 55%'],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:py-24" aria-labelledby="how-heading">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-[#F5F8FF] to-white dark:from-[#0B1020] dark:via-[#0E1533] dark:to-[#0B1020]"
      />
      <SectionHeader
        eyebrow="How it works"
        title={<span id="how-heading">Live in five steps, most of it done from your phone</span>}
      />

      <ol ref={listRef} className="relative mx-auto mt-14 max-w-3xl">
        <span
          aria-hidden
          className="absolute left-[27px] top-2 h-[calc(100%-2rem)] w-[2px] rounded-full bg-slate-200 dark:bg-white/10 sm:left-[31px]"
        />
        <motion.span
          aria-hidden
          style={{ scaleY: reduce ? 1 : fill }}
          className="absolute left-[27px] top-2 h-[calc(100%-2rem)] w-[2px] origin-top rounded-full bg-gradient-to-b from-[#3F5EF7] via-[#3F5EF7] to-[#12B76A] shadow-[0_0_12px_rgba(63,94,247,0.55)] sm:left-[31px]"
        />

        {STEPS.map((step, i) => (
          <TimelineStep
            key={step.title}
            step={step}
            index={i}
            state={i === active ? 'current' : i < active ? 'past' : 'future'}
            onEnter={handleEnter}
          />
        ))}
      </ol>
    </section>
  );
}